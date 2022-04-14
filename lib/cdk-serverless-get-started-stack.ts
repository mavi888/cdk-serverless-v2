import { Construct } from 'constructs';
import { Stack, StackProps, CfnOutput } from 'aws-cdk-lib';

import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import {Function, Runtime, Code } from "aws-cdk-lib/aws-lambda";
import {RestApi, LambdaIntegration} from "aws-cdk-lib/aws-apigateway";
export class CdkServerlessGetStartedStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    //Dynamodb table definition
    const table = new Table(this, "Hello", {
      partitionKey: { name: "name", type: AttributeType.STRING },
    });

    // lambda function
    const dynamoLambda = new Function(this, "DynamoLambdaHandler", {
      runtime: Runtime.NODEJS_12_X,
      code: Code.fromAsset("functions"),
      handler: "function.handler",
      environment: {
        HELLO_TABLE_NAME: table.tableName,
      },
    });

    // permissions to lambda to dynamo table
    table.grantReadWriteData(dynamoLambda);

    // create the API Gateway with one method and path
    const api = new RestApi(this, "hello-api");

    api.root
      .resourceForPath("hello")
      .addMethod("GET", new LambdaIntegration(dynamoLambda));

    new CfnOutput(this, "HTTP API URL", {
      value: api.url ?? "Something went wrong with the deploy",
    });
  }
}
