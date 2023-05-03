import boto3
import os
import json
from base64 import b64decode

def ssm_param_adder(name,paramValue,paramType,env,keyId,ssm,jobId,code_pipeline):

    paramName='/'+env+'/'+name
    description=paramName + " for the environment " + env
    print (paramType)
    print ("Adding " + description)
    try:
        if (paramType == "SecureString"):
            response = ssm.put_parameter(
                Name=paramName,
                Description=description,
                Value=paramValue,
                Type=paramType,
                KeyId=keyId,
                Overwrite=True
            )
        else:
            response = ssm.put_parameter(
                Name=paramName,
                Description=description,
                Value=paramValue,
                Type=paramType,
                Overwrite=True
            )


        if (int(response.get('ResponseMetadata').get('HTTPStatusCode'))==200):
            print ("Added Successfully")
            success=True
        #    code_pipeline.put_job_success_result(jobId=jobId)
        else:

            print ("failed")
            success=False
            code_pipeline.put_job_failure_result(jobId=jobId, failureDetails={'message': "Lambda Execution Failed", 'type': 'JobFailed'})
    except:
        print ("failed trying to add paramter")
        code_pipeline.put_job_failure_result(jobId=jobId, failureDetails={'message': "Lambda Execution Failed", 'type': 'JobFailed'})
    return success

def lambda_handler(event, context ):
    event = json.dumps(event)
    event = json.loads(event)

    userparams = event.get('CodePipeline.job').get('data').get('actionConfiguration').get('configuration').get('UserParameters')
    userparams = json.loads(userparams)
    code_pipeline = boto3.client('codepipeline')
    s3 = boto3.resource('s3')
    paramsFile = s3.Object(userparams.get('S3BucketName'), userparams.get('ParamListS3ObjectPath'))
    print (paramsFile)
    params = paramsFile.get()['Body'].read().decode('utf-8')
    params=json.loads(params)
    jobId = event.get('CodePipeline.job').get('id')

    if userparams.get('KMSKeyId') is None or userparams.get('KMSKeyId') =='':
        keyId=os.environ['EPSSSMKMSKey']
    else:
        keyId=userparams.get('KMSKeyId')

    env=userparams.get('Environment')
    ssm = boto3.client('ssm')

    if params['parameters']:
        for param in params['parameters']:
            if ( param.get('paramtype') == '' or param.get('paramtype') is None):
                paramType ='SecureString'
            else:
                paramType = param.get('paramtype')
            ParamsAdded=ssm_param_adder(param['name'],param['value'],paramType,env,keyId,ssm,jobId,code_pipeline)
        if ParamsAdded is True:
            code_pipeline.put_job_success_result(jobId=jobId)
    else:
        print ("No parameters in the file")
        code_pipeline.put_job_success_result(jobId=jobId)

    return
