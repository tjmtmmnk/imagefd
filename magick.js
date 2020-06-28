import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

let hasFetched = {};
const doMagic = async () => {
    const images = Array.from(document.querySelectorAll("img")).filter(image => image.src !== "" && !hasFetched[image.src]);

    const imageArrayBuffers = await Promise.all(images.map(async image => {
        hasFetched[image.src] = true;
        try {
            const url = 'https://imagefd.work/image';
            const fetchedImage = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json; charset=UTF-8' },
                body: JSON.stringify(
                    {
                        url: image.src,
                    }
                ),
            }).catch(e => {
                throw new Error(e);
            });
            if (!fetchedImage.ok) throw new Error('4xx or 5xx');

            return await fetchedImage.arrayBuffer();
        } catch (err) {
            return new ArrayBuffer(0);
        }
    }));

    images.forEach(async (image, index) => {
        if (imageArrayBuffers[index].byteLength === 0) return;

        const sourceBytes = new Uint8Array(imageArrayBuffers[index]);
        const inputFiles = [{
            name: 'srcFile.png',
            content: sourceBytes,
        }];
        const command = ['convert', 'srcFile.png', '-background', '#ffffff', '-alpha', 'deactivate', '-flatten', 'outFile.png'];

        const processedFiles = await Magick.Call(inputFiles, command);

        const firstOutputImage = processedFiles[0];
        if (firstOutputImage === undefined || firstOutputImage["blob"] === undefined) return;

        image.src = URL.createObjectURL(firstOutputImage["blob"]);
    });
}

window.addEventListener('scroll', (e) => {
    doMagic();
});