// 1.0 by Guilherme Lirio
//
// all audios and videos must be converted to Alexa format before posting it to AWS
// files in AWS must be given public permission before using it here
// https://developer.amazon.com/en-US/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html

const Alexa = require('ask-sdk-core');
const VIDEO_URL = 'https://bmw-ix3.s3.amazonaws.com/videos/audio1.mp4';
const AUDIO_URL = 'https://bmw-ix3.s3.amazonaws.com/audios/audio1.mp3';

//Verify Display
function supportsDisplay(handlerInput) {
    const hasDisplay =
        handlerInput.requestEnvelope.context &&
        handlerInput.requestEnvelope.context.System &&
        handlerInput.requestEnvelope.context.System.device &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
        handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL'];
    return hasDisplay;
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {

        if (supportsDisplay(handlerInput)) {
            console.log('31 => Tem suporte à APL');

            handlerInput.responseBuilder
                .addDirective({
                    type: "Alexa.Presentation.APL.RenderDocument",
                    version: '1.1',
                    token: "HELLO_WORLD_TOKEN",
                    document: {
                        "type": "APL",
                        "version": "2022.1",
                        "import": [
                            {
                                "name": "alexa-viewport-profiles",
                                "version": "1.2.0"
                            }
                        ],
                        "onMount": [],
                        "mainTemplate": {
                            "parameters": [
                                "imageData"
                            ],
                            "item": [
                                {
                                    "type": "Container",
                                    "id": "cardSpeakContainer",
                                    "width": "100%",
                                    "height": "100%",
                                    "speech": "${imageData.properties.preambleSpeech}",
                                    "items": [
                                        {
                                            "type": "Container",
                                            "direction": "row",
                                            "width": "100%",
                                            "height": "100%",
                                            "alignItems": "center",
                                            "data": "${imageData.properties}",
                                            "items": [
                                                {
                                                    "type": "Video",
                                                    "id": "videoPlayer",
                                                    "width": "100%",
                                                    "height": "100%",
                                                    "autoplay": true,
                                                    "source": "${data.video_url}",
                                                    "audioTrack": "foreground",
                                                    "scale": "best-fill",
                                                    "onEnd": [
                                                        {
                                                            "type": "SpeakItem",
                                                            "componentId": "cardSpeakContainer"
                                                        }
                                                    ]
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }
                    },
                    datasources: {
                        "imageData": {
                            "type": "object",
                            "properties": {
                                "speechText": "<speak>Até mais!</speak>",
                                "video_url": VIDEO_URL
                            },
                            "transformers": [
                                {
                                    "inputPath": "speechText",
                                    "outputName": "preambleSpeech",
                                    "transformer": "ssmlToSpeech"
                                }
                            ]
                        }
                    }
                }).speak(`Olá, seja bem vindo!`).withShouldEndSession(true)

        } else {
            console.log('102 => Tem suporte apenas à áudio');

            handlerInput.responseBuilder
                .speak(`Olá, seja bem-vindo! <break time="1s"/> <audio src="${AUDIO_URL}" /> <break time="1s"/> Até mais!`)
                .withShouldEndSession(true)
        }

        return handlerInput.responseBuilder.getResponse();

    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const speakOutput = 'Goodbye!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .withCustomUserAgent('sample/hello-world/v1.2')
    .lambda();
