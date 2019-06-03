window.onload= () => {
  alert("Turn around your screen if it's not vertical! --------- To be a part of this collaborative twitter poster you need to start your tweet with: twitterposter #x + a number between 1 and 15 _ y + a number between 1 and 26. After this you can tweet anything you like and it will end up on the given position on the site. Enjoy! -------- example: twitterposter #x2_y5 TEST");
  var socket = io('http://localhost:3000');
  var rgxForTwitter = new RegExp('twitterposter #([^\\s]*)','g');
  var rgxForRt = new RegExp("\s*@[^:]*:", "g");
  const regexForValidPos = /x\d+_y\d+/


  const gridContainer = document.querySelector(".grid-container-x");


for(let y = 0; y< 26; y++){

  for(let x = 0; x< 15; x++){
        const gridDiv = document.createElement("div");
        gridDiv.className = "grid-item";
        gridDiv.id = "x"+(x+1) + "_y" + (y+1);
        gridContainer.append(gridDiv);
    }
  }


  socket.on('tweet', function(data){
    console.log(data);
    const rawHashtags = data.entities.hashtags.map(function(t){
      return t.text;
    });

    console.log("rawHashtags", rawHashtags);

    const positionHash = rawHashtags.find((hash) => {
      return hash.match(regexForValidPos)
    })

    console.log("positionHash", positionHash);


    if(positionHash){
        const cleanTweetText = data.text
                      .replace(rgxForTwitter, '')
                      .replace(rgxForRt, '');

        const tweetHTMLWithoutHashtags = cleanTweetText;

        const xy = positionHash.split("_");
        const x = parseInt( xy[0].match(/\d+/g) );
        const y = parseInt( xy[1].match(/\d+/g) );

        const grid = gridContainer.querySelector( "#x" + x + "_y" + y );


        const tweetElement = document.createElement("div");
        tweetElement.className = "tweet";
        tweetElement.innerHTML = tweetHTMLWithoutHashtags;

        tweetElement.style.fontSize = Math.floor((Math.random() * 5) + 0.1 )+"vw";
        // tweetElement.style.backgroundColor = "white";


        grid.innerHTML = "";
        grid.append(tweetElement);
        console.log("tweet added", tweetElement);
        setTimeout(()=>{
          tweetElement.classList.add("show");
        }, 500);


    }


  });

}
