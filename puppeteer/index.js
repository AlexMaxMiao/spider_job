const puppeteer = require('puppeteer');

const user_info = {
  account: "",
  password: ""
}
/**
 * 设置webdirve false
 * @param  page 
 */
async function setWebDriver(page) {
  await page.evaluate(() => {
    Object.defineProperties(navigator, {
      webdriver: {
        get: () => false
      },
      languages: {
        get: () => ['en-US', 'en']
      },
      plugins: {
        get: () => [1, 2, 3, 4, 5, 6],
      }
    })
  }, {});
}
/**
 * 获取拖拽按钮的位置
 * @param  page 
 */
async function getBtnPositon(page) {
  return await page.evaluate(() => {
    const {
      x,
      y
    } = document.querySelector('.btn_slide').getBoundingClientRect()
    return {
      btn_left: x + 5,
      btn_top: y + 5
    }
  }, {});
}


(async () => {

  const browser = await puppeteer.launch({
    executablePath: "./chrome-win/chrome.exe",
    headless: false,
    defaultViewport: {
      width: 1920,
      height: 768
    },
    // devtools: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized']
  });

  const page = await browser.newPage();
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299');
  await page.goto('https://login.zhipin.com/?ka=header-login', {
    waitUntil: "load",
    timeout: 60000
  });
  //设置webdrivice False
  await setWebDriver(page);

  const login = async () => {
    const distance1 = await page.evaluate(() => {
      return document.querySelector('.scale_text').getBoundingClientRect().width
    });

    const btn_position = await getBtnPositon(page);
    await page.focus("#wrap input[name='account']")
    await page.type("#wrap input[name='account']", user_info.account);
    await page.focus("#wrap input[name='password']");
    await page.type("#wrap input[name='password']", user_info.password);
    await page.mouse.move(btn_position.btn_left, btn_position.btn_top)
    await page.mouse.down({
      button: 'left'
    })
    await page.waitFor(800);
    await page.mouse.move(btn_position.btn_left + distance1 + Math.random() * 10, btn_position.btn_top + Math.random() * 10, {
      steps: 20
    })
    await page.mouse.up()
    await page.waitFor(1000);
    await page.click("#wrap > div.sign-wrap > div.sign-form.sign-pwd > form > div.form-btn > button");
    await page.waitForNavigation();
  }
  await login();

  await page.goto("https://www.zhipin.com/geek/new/index/chat?ka=header-message");
  const eles = await page.evaluate(() => {
    return [...document.querySelectorAll("ul .notice-badge")].map((item, index) => {
      if (item.textContent == 1) {
        return index;
      }
    }).filter(item => item > 0);
  }, {});
  //点击按钮

  for (let index = 0; index < eles.length; index++) {
    const element = eles[index];
    await page.click(`.user-list > ul:nth-child(2) > li:nth-child(${element+1})`)
    
  }
  
  // //输入留言
  // await page.evaluate(() => {
  //   document.querySelector('.chat-input').textContent = 'dddd';
  // }, {});
  // //发送留言
  // await page.click('.btn-send');
  setInterval(() => {
    console.log(Date.now())
  }, 5000);
  // await browser.close();
})()