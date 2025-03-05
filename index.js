const api = 'c7a18f786e32858364604bb1b3c8f66b';
        let fetched_data = true;
        let city;
        const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${api}`;

        function getDetails(name, lat, lon, country, state) {
            weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api}`;
            fetch(weather_url)
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    const contents = document.getElementById('contents').innerHTML =
                        `<div class="inner-content">
                            <h2>${Math.round((data.main.temp - 273.15))}&#8451</h2> 
                            <h5>in ${name}</h5>
                            <br>
                            <h5><span>min:${Math.round((data.main.temp_min - 273.15))}&#8451</span> 
                            <span>max:${Math.round((data.main.temp_max - 273.15))}&#8451</span></h5>
                            <br>
                            <h5>${data.weather[0].description}</h5>
                            <div class="weather-icon">
                                <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="image">
                                <div class="wind-speed">
                                    <h4><img src="./src/wind.png" width="30"> ${data.wind.speed} <span>km/h</span></h4>
                                    <h4><img src="./src/pressure-gauge.png" width="30"> ${data.main.pressure} <span>kPa</span></h4>
                                    <h4><img src="./src/humidity.png" width="30"> ${data.main.humidity} <span>g/kg</span></h4>
                                </div>
                            </div>
                        </div>`;
                    fetched_data = false;
                });
        }

        function myFunc() {
            var element = document.body;
            element.classList.toggle("dark-mode");
            var content = document.getElementById('div_wraper');
            content.classList.toggle('div_wraper_dark');
        }

        let dark_or_light = true;
        const toggleButton = document.getElementById('toggle');
        toggleButton.addEventListener('click', () => {
            dark_or_light = !dark_or_light;
            myFunc();
            toggleButton.innerText = toggleButton.innerText === 'LightMode' ? 'DarkMode' : 'LightMode';
        });

        document.getElementById('weatherform').addEventListener('submit', function (e) {
            e.preventDefault();

            const city = document.getElementById('city_input').value;
            if (city) {
                fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${api}`)
                    .then(res => res.json())
                    .then(data => {
                        let { name, lat, lon, country, state } = data[0];
                        console.log(name, lat, lon, country, state);
                        getDetails(name, lat, lon, country, state);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        });

        // Time
        function updateClock() {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();

            hours = (hours < 10) ? '0' + hours : hours;
            minutes = (minutes < 10) ? '0' + minutes : minutes;
            seconds = (seconds < 10) ? '0' + seconds : seconds;

            const timeString = hours + ':' + minutes + ':' + seconds;

            document.getElementById('Clock').textContent = timeString;

            const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            let today = new Date();
            const year = today.getFullYear();
            const month = months[today.getMonth()];
            const day = String(today.getDate()).padStart(2, '0');
            const formattedDate = `${day} ${month} ${year}`;

            if (fetched_data) {
                document.getElementById('contents').innerHTML = `<div class="date" id="date"><h1>${timeString}</h1><h2>${formattedDate}</h2></div><p style="font-size:13px ;padding-left:85px">press here to stop</p>`;
            } else {
                document.getElementById('Clock').style.display = "block";
            }
        }

        updateClock();
        setInterval(updateClock, 1000);

        let is_disabled = false;

        document.getElementById('div_wraper')
            .addEventListener('click', () => { is_disabled = !is_disabled });

        // Canvas
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', function () {
            canvas.height = window.innerHeight;
            canvas.width = window.innerWidth;
        });

        sunImg = new Image();
        sunImg.src = "./src/sun1.jpeg";

        moonImg = new Image();
        moonImg.src = "./src/moon2.jpg";

        let position = {
            x: canvas.width,
            y: canvas.height
        }
        let x = position.x / 2;
        let y = position.y / 6;
        let changeY = 1;
        let rateY = 0.01;
        let x1 = 0;

        function moveSun() {
            y = y - changeY;
            changeY = changeY - rateY;
            if (x1 >= canvas.width) {
                console.log("Entered")
                x1 = 0;
                y = position.y / 7;
                changeY = 1;
                rateY = 0.01;
                myFunc();
                dark_or_light = false;
            };
            x1 = x1 + 5;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(sunImg, x1, y, 100, 100);
        }

        function moveMoon() {
            y = y - changeY;
            changeY = changeY - rateY;
            if (x1 > canvas.width) {
                x1 = 0;
                y = position.y / 7;
                changeY = 1;
                rateY = 0.01;
                myFunc();
                dark_or_light = true;
            };
            x1 = x1 + 5;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(moonImg, x1, y, 100, 100);
            ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        function animation() {
            if (!is_disabled) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (dark_or_light) {
                    moveSun();
                } else {
                    moveMoon();
                }
            } else {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        }

        setInterval(animation,1000);
        //change the time to match its motion to actual sun motion
    