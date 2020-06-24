import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

const doMagic = async () => {
    const images = Array.from(document.querySelectorAll("img"))
        .filter(image => {
            const isImage = /(jpg|jpeg|gif|png)/i.test(image.src);
            return isImage === true;
        });

    const imageArrayBuffers = await Promise.all(images.map(async image => {
        const url = 'https://imagefd.work/image';
        const fetchedImage = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json; charset=UTF-8' },
            body: JSON.stringify(
                {
                    url: image.src,
                }
            ),
        });
        const arrayBuffer = await fetchedImage.arrayBuffer();
        return arrayBuffer;
    }));

    images.forEach(async (image, index) => {
        const sourceBytes = new Uint8Array(imageArrayBuffers[index]);
        const inputFiles = [{
            name: 'srcFile.png',
            content: sourceBytes,
        }];
        const command = ['convert', 'srcFile.png', '-background', '#ffffff', '-alpha', 'deactivate', '-flatten', 'outFile.png'];
        const processedFiles = await Magick.Call(inputFiles, command);
        const firstOutputImage = processedFiles[0];
        image.src = URL.createObjectURL(firstOutputImage["blob"]);
    });
}

doMagic();
