import JSZip from "jszip";

function downloadZipOfFiles(files) {
  let zip = new JSZip();
  files.flat().map(file => zip.file(file.filename, file.blob));

  return zip.generateAsync({type: 'blob'}).then(blob => {
    let tag = document.createElement('a');
    let urlCreator = window.URL || window.webkitURL;

    tag.href = urlCreator.createObjectURL(blob);
    tag.download = 'emojis.zip';

    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  });
}

export default downloadZipOfFiles;
