import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

const doMagic = async () => {
    const images = Array.from(document.querySelectorAll("img")).filter(img => img.src !== '');
    const proxiedImages = await Promise.all(images.map(async image => {
        const url = 'https://imagefd.work/image?url=' + image.src;
        const fetchedImage = await fetch(url);
        const arrayBuffer = await fetchedImage.arrayBuffer();
        return arrayBuffer;
    }));

    for (let i = 0; i < images.length; i++) {
        const sourceBytes = new Uint8Array(proxiedImages[i]);
        const inputFiles = [{
            name: 'srcFile.png',
            content: sourceBytes,
        }];
        const command = ['convert', 'srcFile.png', '-background', '#ffffff', '-alpha', 'deactivate', '-flatten', 'outFile.png'];
        const processedFiles = await Magick.Call(inputFiles, command);
        const firstOutputImage = processedFiles[0];
        images[i].src = URL.createObjectURL(firstOutputImage["blob"]);
    }
}

doMagic();
