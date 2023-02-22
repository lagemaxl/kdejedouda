//CLI Prograss bar
const cliProgress = require("cli-progress");

//dotenv
const dotenv = require("dotenv");
dotenv.config();

const BakaUser = process.env.BakaUser; //Your username
const BakaPass = process.env.BakaPass; //Your password

//AXIOS
const axios = require("axios");
const qs = require("qs");
const requestData = qs.stringify({
  username: BakaUser,
  password: BakaPass,
  returnUrl: "/Timetable/Public/Actual/Class/2F",
  login: "",
});

const he = require("he");
const fs = require("fs");

//Progress bar
const bar1 = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);

//MISC
let counter = 0;
let teacherCount = 0;
let infoMessage;
let teachers = [];
let teacherCodes = [];

//Returns value of counter (how many teachers are fetched)
exports.getCounter = () => {
  return counter;
};

//returns teacherCount (How many teachers there is)
exports.getTeacherCount = () => {
  return teacherCount;
};

//returns infoMessage (What is this app doing)
exports.getInfoMessage = () => {
  return infoMessage;
};

//Fetches all teachers
exports.fetchTeachers = function () {
  console.log("Fetching teachers");
  counter = 0;

  //Clear json file
  fs.writeFileSync("TeacherPositions.json", JSON.stringify([]));

  (async () => {
    infoMessage = "Getting Access Token";
    const accessToken = await getAccessToken();
    infoMessage = "Fetching codes";
    teacherCodes = await fetchTeacherCodes(accessToken);
    teacherCount = teacherCodes.length;

    infoMessage = "Fetching teachers";

    //Show progress bar
    bar1.start(teacherCodes.length, 0);

    //Get all teachers from TeacherCodes.json and get their classes
    teachers.length = 0;
    for (let i in teacherCodes) {
      getTeacher(teacherCodes[i].code, teacherCodes[i].name, accessToken);
    }
  })();
};

function getAccessToken() {
  console.log("Getting access token");

  return new Promise((resolve) => {
    axios({
      method: "POST",
      url: "https://spsul.bakalari.cz/api/login",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: `client_id=ANDR&grant_type=password&username=${BakaUser}&password=${BakaPass}`,
    })
      .then((response) => {
        resolve(response.data.access_token);
      })
      .catch((error) => {
        console.log(
          error.response.status + " - " + error.response.data.error_description
        );
      });
  });
}

function getTeacher(code, name, accessToken) {
  //Get request for teacher
  return new Promise((resolve) => {
    axios({
      method: "GET",
      url: `https://spsul.bakalari.cz/Timetable/Public/Actual/Teacher/${code}`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: requestData,
    })
      .then(function (response) {
        let data = response.data; //Store data
        data = he.decode(data); //Decode data, that means translate html characters to normal ones

        data = data.split(`<div class="bk-timetable-cell"`); //split it based on timetable cell
        data.shift(); //remove first element from array because its just html code that we don"t want

        //Go through each element and save only those, where class is
        let timetable = [];
        data.forEach((element) => {
          let room;
          let group;
          let className;
          let subject;

          if (element.includes("SHAL")) {
            room = element.substr(element.indexOf("SHAL"), 4);
          } else if (element.includes("SKRY")) {
            room = element.substr(element.indexOf("SKRY"), 4);
          } else if (element.includes("S10")) {
            room = element.substr(element.indexOf("S10"), 4);
          } else if (element.includes("S11")) {
            room = element.substr(element.indexOf("S11"), 4);
          } else if (element.includes("S12")) {
            room = element.substr(element.indexOf("S12"), 4);
          } else if (element.includes("S13")) {
            room = element.substr(element.indexOf("S13"), 4);
          } else if (element.includes("S20")) {
            room = element.substr(element.indexOf("S20"), 4);
          } else if (element.includes("S30")) {
            room = element.substr(element.indexOf("S30"), 4);
          } else if (element.includes("S31")) {
            room = element.substr(element.indexOf("S31"), 4);
          } else if (element.includes("S22")) {
            room = element.substr(element.indexOf("S22"), 4);
          } else if (element.includes("S32")) {
            room = element.substr(element.indexOf("S32"), 4);
          } else if (element.includes("S41")) {
            room = element.substr(element.indexOf("S41"), 4);
          } else if (element.includes("S42")) {
            room = element.substr(element.indexOf("S42"), 4);
          } else if (element.includes("C3")) {
            room = "C3";
          } else if (element.includes("C24")) {
            room = "C24";
          } else {
            room = "Neučí";
          }

          //Add which group the teacher will teach
          if (room !== "Neučí") {
            let groupIndex = element.indexOf(`"group":"`); //Find where group is defined
            let newElement = element.slice(groupIndex + 9); //Slice string from groupIndex to end so that we can extract the name
            let endingIndex = newElement.indexOf(`"`); //Find ending quotes for group name
            group = newElement.slice(0, endingIndex); //Extract the name of group

            className = newElement.slice(0, endingIndex);
            className = className.split(" ")[0];

            if (group.includes("S1")) {
              group = group.slice(0, group.indexOf("S1", 4));
              group = "1";
            } else if (group.includes("S2")) {
              group = group.slice(0, group.indexOf("S2", 4));
              group = "2";
            } else {
              group = "celá";
            }
          }

          //Add which group the teacher will teach
          if (room !== "Neučí") {
            let subjectIndex = element.indexOf(`"subjecttext":"`); //Find where group is defined
            let newElement = element.slice(subjectIndex + 15); //Slice string from groupIndex to end so that we can extract the name
            let endingIndex = newElement.indexOf(` |`); //Find ending quotes for group name
            subject = newElement.slice(0, endingIndex); //Extract the name of group

            timetable.push({
              room: room,
              className: className,
              group: group,
              subject: subject,
            });
          } else {
            timetable.push({
              room: room,
              className: "",
              group: "",
              subject: "",
            });
          }
        });

        //Split it into days
        let mon = timetable.splice(0, 11);
        let tue = timetable.splice(0, 11);
        let wed = timetable.splice(0, 11);
        let thu = timetable.splice(0, 11);
        let fri = timetable.splice(0, 11);

        counter++;
        teachers.push({ name: name, pos: [mon, tue, wed, thu, fri] });
        bar1.update(counter);
        // if teachers == [{"name":"Doudík","pos":[[],[],[],[],[]]}] return
        if (JSON.stringify(teachers) == "[{\"name\":\"Doudík\",\"pos\":[[],[],[],[],[]]}]") {
          return;
        }
        //Append teachers to JSON file
        fs.writeFile(
          "TeacherPositions.json",
          JSON.stringify(teachers),
          (e, result) => {
            if (e) console.log("error", e);
          }
        );
        resolve();
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

function fetchTeacherCodes(accessToken) {
  console.log("Fetching teacher codes");

  return new Promise((resolve) => {
    let teacherCodes = []; //Create an empty array, which is going to hold teacher codes and their names
    axios({
      method: "GET",
      url: `https://spsul.bakalari.cz/Timetable/Public/Actual/Class/2F`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: requestData,
    })
      .then(function (res) {
        let data = res.data; //Store data
        data = he.decode(data); //Decode data, that means translate html characters to normal ones

        fs.writeFileSync("TeacherCodes.json", JSON.stringify([]));

        data = data.split(`<option value="U`); //Split it based on teacher codes, which starts by U
        data.shift(); //Remove first element of array, because its unwanted html code
        data.forEach((element) => {
          let teacherCode = "U" + element.slice(0, 4); //Getting teachers code from html
          let index = element.indexOf("</option>");

          let teacherName = element.slice(7, index); //Getting teachers name from html
          teacherName = teacherName.replace(">", ""); //Removing ending character of <option>
          teacherName = teacherName.trim(); //Trimming teachers name from white spaces

          if (isNaN(teacherName.charAt(0))) {
            teacherCodes.push({ code: teacherCode, name: teacherName });
          }
        });
      })
      .then(function () {
        fs.writeFileSync("TeacherCodes.json", JSON.stringify(teacherCodes));
        resolve(teacherCodes);
      })
      .catch(function (error) {
        console.log(error);
      });
  });
}

(async () => {
  const accessToken = await loadAccessToken();
  const doudik = "UU06R";
  const doudikName = "Doudík";
  getTeacher(doudik, doudikName, accessToken);
})();

async function loadAccessToken() {
  let accessToken;
  // if token.txt doesn't exist or is empty, get a new access token or it is older than 1 hour
  if (
    !fs.existsSync("token.txt") ||
    fs.readFileSync("token.txt").length === 0 ||
    fs.statSync("token.txt").mtimeMs < Date.now() - 3600000
  ) {
    accessToken = await getAccessToken();
    fs.writeFileSync("token.txt", accessToken);
    console.log("Got new access token and saved it to token.txt");
  
  } else {
    accessToken = fs.readFileSync("token.txt");
    console.log("Access token loaded from token.txt");
  }
  return accessToken;
}