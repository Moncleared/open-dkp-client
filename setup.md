New AWS Client Notes:

1. Export API Gateway, a lot easier. 
	Upon Import, still need to set the Lambdas and Proxy Integration settings
	Also need to assign CORs appropriately, don't forget CognitoInfo header
		'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,CognitoInfo'
	This will resolve  OPTIONs as having no method defined as well, then deploy API

2. Need IAM Role for Cognito Federated Identities, also assign it a Trusted Relationship
	Once the Federated Identity is created, ensure to set it's Authentication Provider Role Selection to Token based
		(this is where the Trust Relationship and IAM role comes into play)

3. Cognito User Pool Group needs to be setup and Role Assigned

4. 