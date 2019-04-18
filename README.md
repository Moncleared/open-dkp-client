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

## Running the client locally
After you've cloned the repo and executed npm install successfully, you can:
``` bash
# Run the application locally
$ npm start
```
Once the application is up and running, you should be able to navigate to localhost:4200 which will redirect you to a 'client selection' page.
Even though you are setting up your own instance and running locally, the client is still designed to look for a subdomain before loading. 

If you reach 'Select a Client' page you know the application has started and is running successfully. If you do not have any clients listed in the drop down that means a couple of things:
* You have not setup your API Gateway/Lambdas and RDS instance yet. The client is AngularJS and requires the backend to be up and running to work
	* You could mock out requests if you choose, but I have not taken the time to implement this
	* You could look at disabling the subdomain checks/validation by simply following the client.service.ts logic around the application to see where it is implemented. There are not too many places
	* Preferred method is to simply setup the backend and ensure you have a client defined in your clients table

## FAQ
* Why do I have to select a client if I am setting this up specifically for my guild?
	* In order to avoid trying to maintain two completely different projects/repositories, we're following the multi-tenancy design, you can simply define one client instead of multiple

* Why is the coloring on my site different than the demo version?
	* We're leveraging [CoreUI](https://coreui.io) for the front end UI framework. The color scheme is different and you can make your own or purchase a dark theme from CoreUI

* Do users have to create accounts?
	* No, the do not. They will be able to review DKP information but not perform any special operations such as requesting raid attendance or editing/associating characters.
	* Creating an account is easy though, it's all built into the UI and handled by AWS Cognito on the backend

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

If you would like to show your support, you can with  [PayPal](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ECQ5J8H82HWT8&source=url), however, it is absolutely not required.