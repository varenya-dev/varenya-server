<h1 align="center"> Varenya Server</h1> <br>
<p align="center">
  <a href="https://gitpoint.co/">
    <img alt="Varenya Logo" title="Varenya Logo" src="https://firebasestorage.googleapis.com/v0/b/varenya-flutter.appspot.com/o/assets%2Fapp_logo_down_yellow.png?alt=media&token=719335c4-1dfd-4c25-b997-9636ddb1ea0f" width="250">
  </a>
</p>

<p align="center">
  A Mental Health Support Application
</p>

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Introduction](#introduction)
- [Features](#features)
- [Feedback](#feedback)
- [Contributors](#contributors)
- [Build Process](#build-process)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

A mental health support app built using Flutter to help people in need to book appointments with mental health professionals such as therapists and also invoke conversation and discussion as a community to help people and help themselves.

<p align="center">
  <img src = "https://firebasestorage.googleapis.com/v0/b/varenya-flutter.appspot.com/o/assets%2FScreenshot_20220330-082521.jpg?alt=media&token=42096d36-9f56-4ea4-9756-c2e33e452c9f" width=200>
  <img src = "https://firebasestorage.googleapis.com/v0/b/varenya-flutter.appspot.com/o/assets%2FScreenshot_20220330-082625.jpg?alt=media&token=dc74dd63-d4a1-4e7e-b808-565ce9062f29" width=200>
</p>

## Features

A few of the things you can do on Varenya:

- View booked appointments on a day to day basis.
- Track your patient's mood activity over a long period of time
- Have a one to one conversation with patients discussing about their struggles.
- Book appointments with mental health professionals.
- Reach out to fellow users in times of dire need via SOS.
- Track your mood activity over a long period of time
- Have a one to one conversation with professionals discussing about your struggles
- And many more!

## Feedback

Feel free to [file an issue](https://github.com/varenya-dev/varenya-server/issues/new/choose). Feature requests are always welcome. If you wish to contribute, please take a quick look at the [guidelines](./CONTRIBUTING.md)!

## Contributors

Please refer the [contribution guidelines](./CONTRIBUTING.md) for exact details on how to contribute to this project.

## Build Process

Here are the instructions on how to build and run this project on your respective systems.

- Clone the project on your system via GitHub.
- Make sure you have [docker](https://www.docker.com/products/docker-desktop) installed on your system since the whole build process depends on [docker](https://www.docker.com/products/docker-desktop) itself.
- Create a [firebase project](https://console.firebase.google.com/) and fetch the web keys and save it as `firebase-admin.env`, format as specified by [this file](./firebase-admin.example.env)
- Run `docker compose -f docker-compose.yml up --build` to build and run a development version of the application.
- To communicate with the API, you can use the endpoint `localhost:5000` to access the same.
