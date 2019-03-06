# OpenDKP - AWS AngularJS client

OpenDKP was developed over the course of several months as a passion project of mine. My primary goal was exposure to Amazon Web Services, as many components as I could. It started off as a simple AngularJS ap hosted in an [S3](https://aws.amazon.com/s3/) bucket, then grew to becoming a full fledged application with middle tier and backend provided by [API Gateway](https://aws.amazon.com/api-gateway/) and [Lambdas](https://aws.amazon.com/lambda/). 

I've always been a huge fan of .NET and this was also a great opportunity to work with [.NET Core](https://docs.microsoft.com/en-us/dotnet/core/) within the AWS environment.

## Disclaimer
Please do not leverage the source code you find in this repository as a standard or best practice. This was primarily a learning experience for integration into AWS and the overall design is piecemeal over a long period of time. Given the opportunity to rebuild, as many engineers would say, I'd do things totally different!

Much refactoring is needed and any contributions are much appreciated

## What is this repository?
This repository is the AngularJS client that communicates with the [API Gateway](https://aws.amazon.com/api-gateway/) and [Lambdas](https://aws.amazon.com/lambda/) hosted on AWS. You can find out more information about the [OpenDKPLambdas here](https://github.com/Moncleared/OpenDKPLambdas).

## Installation

### Clone repo

``` bash
# clone the repo
$ git clone https://github.com/Moncleared/open-dkp-client.git
$ cd open-dkp-client
$ npm install
```

## Setup
* Provide the valid API Gateway URLS to src\app\services\dkp.service.ts and src\app\services\client.service.ts
	* You'll have to reference the OpenDKPLambda project to see the services setup, alternatively, you can re-create this yourself to re-organize

## Usage
``` bash
# Run the application locally
$ npm start
# Build the application for prod
$ npm run build
```
## Documentation
Documentation will be developed and provided over time.

## Contributing

If you are interested in contributing back to this project, feel free to create pull requests. They will be reviwed and merged accordingly.

## Creators

**Moncleared (aka Moncs)**

* <https://github.com/Moncleared>

## Community

Get updates on CoreUI's development and chat with the project maintainers and community members.

- Join us on [Discord](https://discord.gg/WguFyYJ).
- Check us out at [OpenDKP](http://opendkp.com/).

## Support OpenDKP Development

If you would like to show your support, you can with  [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=2R3B5A3LJ5LBC&source=url), however, it is absolutely not required.