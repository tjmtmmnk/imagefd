import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

const doMagic = async () => {
    const images = Array.from(document.querySelectorAll("img")).filter(img => img.src !== '');
    images.forEach(async image => {
        const fetchedSourceImage = await fetch(image.src);
        const sourceBytes = new Uint8Array(await fetchedSourceImage.arrayBuffer());
        const inputFiles = [{
            name: 'srcFile.png',
            content: sourceBytes,
        }];
        const command = ['convert', 'srcFile.png', '-background', '#ffffff', 'outFile.png'];
        const processedFiles = await Magick.Call(inputFiles, command);
        const firstOutputImage = processedFiles[0];
        image.src = URL.createObjectURL(firstOutputImage["blob"]);
    });
}

doMagic();
