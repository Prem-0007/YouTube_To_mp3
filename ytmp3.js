const express = require("express");
const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.urlencoded({extended:true}));
app.use("/downloads",express.static("downloads"));

if(!fs.existsSync("downloads")){
fs.mkdirSync("downloads");
}

app.get("/",(req,res)=>{

res.send(`

<!DOCTYPE html>

<html>

<head>

<title>YouTube MP3 Downloader</title>

<style>

body{
font-family:Arial;
text-align:center;
margin-top:100px;
background:#f2f2f2;
}

input{

width:350px;
padding:10px;
font-size:16px;

}

button{

padding:10px 20px;
font-size:16px;
background:red;
color:white;
border:none;
cursor:pointer;

}

button:hover{

background:darkred;

}

.box{

background:white;
padding:30px;
display:inline-block;
border-radius:10px;
box-shadow:0 0 10px rgba(0,0,0,0.1);

}

a{

display:block;
margin-top:20px;
font-size:18px;
color:green;

}

</style>

</head>

<body>

<div class="box">

<h2>YouTube to MP3 Downloader</h2>

<form action="/download" method="POST">

<input 
type="text"
name="url"
placeholder="Paste YouTube URL"
required
>

<br><br>

<button type="submit">

Download MP3

</button>

</form>

</div>

</body>

</html>

`);

});

app.post("/download",(req,res)=>{

const url=req.body.url;

if(!url){

return res.send("No URL");

}

const filename=Date.now()+".mp3";

const filepath=path.join(__dirname,"downloads",filename);

const command=

`yt-dlp -x --audio-format mp3 --extractor-args "youtube:player_client=android" --no-playlist --retries 3 -o "${filepath}" "${url}"`;

console.log(command);

exec(command,(error,stdout,stderr)=>{

console.log(stdout);
console.log(stderr);

if(error){

return res.send("Download failed try again");

}

res.send(`

<h2>Download Complete </h2>

<a href="/downloads/${filename}" download>

Click here to download MP3

</a>

<br><br>

<a href="/">Download another</a>

`);

});

});

app.listen(3000,()=>{

console.log("Server running");
console.log("http://127.0.0.1:3000");

});
