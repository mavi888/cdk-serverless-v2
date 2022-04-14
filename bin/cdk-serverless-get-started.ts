#!/usr/bin/env node
import {App} from 'aws-cdk-lib';
import { CdkServerlessGetStartedStack } from '../lib/cdk-serverless-get-started-stack';

const app = new App();
new CdkServerlessGetStartedStack(app, 'CdkServerlessGetStartedStack');
