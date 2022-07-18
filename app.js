require('dotenv').config()
const logger = require('./logger');
const cheerio = require('cheerio');
const axios = require('axios');
const { sendEmail } = require('./nodemailer');
const PRODUCT_URL =
  'https://www.amazon.com.mx/SAMSUNG-Galaxy-Tab-Lite-64GB/dp/B0B324KYFD/ref=sr_1_4';
const PRICE_HTML_KEY = '#corePriceDisplay_desktop_feature_div .a-offscreen';
const MAX_EXPECTED_PRICE = 6000; // MXN

const buildAxiosInstance = () => {
  return axios.create({
    baseURL: PRODUCT_URL,
    params: {
      '__mk_es_MX': '%C3%85M%C3%85%C5%BD%C3%95%C3%91',
      'crid': '198BEZQ430MP6',
      'keywords': 'samsung+s6+lite',
      'qid': '1657994824',
      'sprefix': 'samsung+s6+lite%2Caps%2C281',
      'sr': '8-4',
      'ufe': 'app_do%3Aamzn1.fos.649fe0ca-1cbf-43f1-a365-f15699263f39'
    }
  });
}

const catchPrice = (htmlPrice) => {
  return parseFloat(htmlPrice.replace(/[$,]/g, ''));
}

const notify = (currentPrice) => {
  const message = 'Excellent price!';
  logger.log({ level: 'warn', message: message });
  sendEmail(`Samsung S6 Lite: ${currentPrice} MXN`, message)
    .then(mailResponse => {
      logger.log({
        level: 'warn',
        message: mailResponse.response
      });
    })
    .catch(error => {
      logger.log({
        level: 'error',
        message: `Mail failed: ${error}`
      });
    });
}

const init = async () => {
  const axiosInstance = buildAxiosInstance();
  const data = (await axiosInstance.get()).data;
  const $ = cheerio.load(data);
  const currentPrice = catchPrice($(PRICE_HTML_KEY).html());
  if (currentPrice <= MAX_EXPECTED_PRICE)
    notify(currentPrice);
  else
    logger.log({ level: 'info', message: 'Price rejected' }); 
}

init();
