# data-pipeline
example project covering data ingress


## Manual Steps
Create an API Key for client calling the endpoint


```
aws apigateway create-api-key --region eu-west-1 --name 'Manual-Datapipeline-dev' --description 'Client API key for dev' --enabled
```
```
{
    "id": "4ccarrg7wg",
    "value": "5GH75HAjFk3cpsdjAqII66PqX05lyn3C4ODDBWJ2",
    "name": "Manual-Datapipeline-dev",
    "description": "Client API key for dev",
    "enabled": true,
    "createdDate": "2023-05-03T07:39:40+01:00",
    "lastUpdatedDate": "2023-05-03T07:39:40+01:00",
    "stageKeys": []
}
```

Create S3 buckets for codepipeline and source code
```
aws s3 mb s3://codepipeline-eu-west-2-60717085471 --profile spirit-software
aws s3 mb s3://spirit-data-pipeline --profile spirit-software



aws s3 mb s3://codepipeline-artifactstore-dp-dev-eu-west-2 --profile spirit-software
```


Create pipeline

```
aws cloudformation create-stack \
  --stack-name data-pipeline-codebuild-dev \
  --template-body file:///Users/ianmaher/Code/spirit/data-pipeline/config/pipeline/code-pipeline.json --profile spirit-software --capabilities CAPABILITY_NAMED_IAM
```

