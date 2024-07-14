const http = require('http');
const https = require('https');
const Stream = require('stream').Transform;
const fs = require('fs');

const URL_THUMBNAIL = 'http://ic-common.pmang.cloud/static/bdt_book/thumbnail/';
const URL_FULL = 'http://ic-common.pmang.cloud/static/bdt_book/character/';
const API_CHARACTERS = 'https://browndust-api.pmang.cloud/v1/book/character/getAll';

const API_CHARACTERS_FILE_NAME = `getAll.json`;

https.request(API_CHARACTERS, response => {
  const data = new Stream();
  console.log('Download api resource...');
  response.on('data', chunk => data.push(chunk));
  response.on('end', () => fs.writeFile(`${__dirname}/${API_CHARACTERS_FILE_NAME}`, data.read(), downloadThumbnails));
}).end();

function downloadThumbnails(error) {

  if (error) throw Error('downloadThumbnails', error);

  const thumbnails = require(`./${API_CHARACTERS_FILE_NAME}`);
  Promise.all(
    thumbnails
      .map(d =>{
        const iconName = d._uiIconImageName.split('*')[1];
        return {
          name: `${d._uiIconImageName.split('*')[1]}.png`,
          url_thumbnail: `${URL_THUMBNAIL}${iconName}.png`,
          url_full: `${URL_FULL}${d._uiIconImageName.split('*')[1]}.png`,}
      })
      .map(({ url_thumbnail,url_full, name }, index, arr) => {
        try {
          http.request(url_thumbnail, response => {
            const data = new Stream();
            console.log(`parse:${url_thumbnail}`);
            response.on('data', chunk => data.push(chunk));
            response.on('end', () => fs.writeFileSync(`./public/img/thumbnail/${name}`, data.read()));
          }).end();

          http.request(url_full, response => {
            const data = new Stream();
            console.log(`parse:${url_full}`);
            response.on('data', chunk => data.push(chunk));
            response.on('end', () => fs.writeFileSync(`./public/img/full/${name}`, data.read()));
          }).end();

        } catch (error) {
          console.log('error thumbnails', error);
        }
      })
  ).then(() => {
  });
}


// 용병 1개 데이터
// {
// 	"_filterType":2,
// 	"_code":4746,
// 	"_uniqueCode":474,
// 	"_checkRegion":"100*300*400*500*600*700",
// 	"_rewardGroupCode":6,
// 	"_titleCode":1,
// 	"_charName":"미네르바",
// 	"_charName_JAP":"ミネルヴァ",
// 	"_charName_ENG":"Minerva",
// 	"_charName_TW":"密涅瓦",
// 	"_charName_TH":"Minerva",
// 	"_charName_GER":"Minerva",
// 	"_charName_FRE":"Minerva",
// 	"_charName_SPA":"Minerva",
// 	"_uiIconImageName":"IconGUI29*char4744icon",
// 	"_type":2,
// 	"_star":6,
// 	"_growType":2
// }
// 전체 주소
// https://browndust-api.pmang.cloud/v1/book/character/getAll
// 섬네일
// https://ic-common.pmang.cloud/static/bdt_book/thumbnail/char4614icon.png
// 풀 일러스트
// https://ic-common.pmang.cloud/static/bdt_book/illust/4_npc259_6.png
// SD 일러스트
// https://ic-common.pmang.cloud/static/bdt_book/character/char4614.png
// 조력자 섬네일
// https://ic-common.pmang.cloud/static/bdt_book/illust/7_helper155_6.png
// 조력자 풀 일러스트
// https://ic-common.pmang.cloud/static/bdt_book/character/char461499.png
