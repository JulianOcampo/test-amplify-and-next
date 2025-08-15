import { Stack, RemovalPolicy } from "aws-cdk-lib";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as s3 from "aws-cdk-lib/aws-s3";

interface StackContext {
    stack: Stack;
}

export function defineResources({ stack }: StackContext) {
    // 1️⃣ Crear bucket para almacenar layers
    const layersBucket = new s3.Bucket(stack, "LambdaLayersBucket", {
        bucketName: `${stack.stackName.toLowerCase()}-lambda-layers`,
        removalPolicy: RemovalPolicy.RETAIN, // para no borrarlo al destruir el stack
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        versioned: true,
    });

    // 2️⃣ Definir layers tomando el .zip desde el bucket
    //    Ojo: estos .zip deben estar subidos antes del deploy o después con un paso manual/CI
    const ffmpegLayer = new lambda.LayerVersion(stack, "FfmpegLayer", {
        layerVersionName: "layer-ffmpeg",
        compatibleRuntimes: [lambda.Runtime.NODEJS_20_X, lambda.Runtime.NODEJS_22_X, lambda.Runtime.NODEJS_18_X],
        description: "FFmpeg static for Lambda",
        code: lambda.Code.fromBucket(layersBucket, "ffmpeg.zip"), // clave del archivo en el bucket
    });

    const puppeteerUtilsLayer = new lambda.LayerVersion(stack, "PuppeteerUtilsLayer", {
        layerVersionName: "layer-puppeteer-utils",
        compatibleRuntimes: [lambda.Runtime.NODEJS_20_X, lambda.Runtime.NODEJS_22_X, lambda.Runtime.NODEJS_18_X],
        description: "Puppeteer utils",
        code: lambda.Code.fromBucket(layersBucket, "puppeteer-utils.zip"), // clave del archivo en el bucket
    });

    return { layersBucket, ffmpegLayer,  puppeteerUtilsLayer };
}
