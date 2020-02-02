import JSZip from "jszip";

function downloadZipOfFiles(files, zipname) {
  zipname = zipname || "emojis";
  let zip = new JSZip();
  files.flat().map(file => zip.file(file.filename, file.blob));

  return zip.generateAsync({ type: "blob" }).then(blob => {
    let tag = document.createElement("a");
    let urlCreator = window.URL || window.webkitURL;

    tag.href = urlCreator.createObjectURL(blob);
    tag.download = zipname + ".zip";

    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  });
}

export default downloadZipOfFiles;
