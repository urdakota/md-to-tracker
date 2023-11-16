const select = (_, el = document) => el.querySelector(_);

async function get_kraken_download(link) {
  const base_headers = {
    "content-type":
      "multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW",
    "cache-control": "no-cache"
  };
  const URL_KEY = "url";
  const BASE = "https://krakenfiles.com";
  
  var token
  var hash
  var link

  await fetch(link)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then((html) => {
      // Create a temporary HTML element (e.g., a div)
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;

      // Find the input element with id "dl-token" and get its "value" attribute
      const tokenElement = tempDiv.querySelector("#dl-token");
      const linkElement = tempDiv.querySelector("#dl-form");
      token = tokenElement ? tokenElement.value : null;
      link = linkElement ? linkElement.action : null;
      const hashElements = tempDiv.querySelectorAll("div[data-file-hash]");

      // Extract the "data-file-hash" attribute values
      const hashes = Array.from(hashElements, (element) =>
        element.getAttribute("data-file-hash")
      );

      if (hashes.length < 1) {
        throw new Error(`Hash not found for page_link: ${url}`);
      }

      hash = hashes[0];

      console.log("Download Hash:", dlHash);
      console.log("Token:", token);
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
 
  console.log(link);

        //save
    data = {"token":`${token}`}
    async with s.post(`${link}`, data=data) as r:
}

get_kraken_download("https://krakenfiles.com/view/0j7XazHS7Y/file.html");
