const { Builder, By, Key, until } = require('selenium-webdriver');

let driver = new Builder()
  .forBrowser('firefox')
  .build();

driver.get('https://app.mobilecause.com/form/h1I43g');
driver.findElement(By.name('first_name')).sendKeys('Fian');
driver.findElement(By.name('last_name')).sendKeys('Lian');
driver.findElement(By.name('phone')).sendKeys('999-999-9999');
driver.findElement(By.name('email')).sendKeys('test@t.com');
driver.findElement(By.name('street_address')).sendKeys('8 Street');
driver.findElement(By.name('city')).sendKeys('Ridge');
driver.findElement(By.name('state')).sendKeys('CA');
driver.findElement(By.name('zip')).sendKeys('90027');
driver.findElement(By.name('button')).click();
driver.quit();