import test from 'node:test'
import assert from 'node:assert/strict'
import { spawn } from 'node:child_process'
import process from 'node:process'
import { setTimeout as delay } from 'node:timers/promises'
import { Builder, By, Key, until } from 'selenium-webdriver'
import chrome from 'selenium-webdriver/chrome.js'

const HOST = '127.0.0.1'
const PORT = 5173
const BASE_URL = `http://${HOST}:${PORT}`

let serverProcess
let driver

async function waitForServer(url, timeoutMs = 20000) {
  const start = Date.now()

  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url)
      if (response.ok) return
    } catch {
      // Ignore while the dev server is still booting.
    }

    await delay(250)
  }

  throw new Error(`Timed out waiting for server: ${url}`)
}

test.before(async () => {
  serverProcess = spawn(
  'npx',
  ['vite', '--host', HOST, '--port', String(PORT), '--strictPort'],
  {
    stdio: 'ignore',
    shell: true,   // IMPORTANT FIX
    env: {
      ...process.env,
      CI: '1',
    },
  }
)

  await waitForServer(BASE_URL)

  const options = new chrome.Options().addArguments(
    '--headless=new',
    '--window-size=1400,1200',
    '--disable-gpu',
    '--no-sandbox',
  )

  driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(options)
    .build()
})

test.after(async () => {
  if (driver) {
    await driver.quit()
  }

  if (serverProcess) {
    serverProcess.kill('SIGTERM')
  }
})

test('loads the homepage and shows products', async () => {
  await driver.get(BASE_URL)

  const heading = await driver.findElement(By.css('h1')).getText()
  assert.equal(heading, 'Simple Ecommerce Homepage')

  const cards = await driver.findElements(By.css('.product-card'))
  assert.equal(cards.length, 6)
})

test('filters products by search term', async () => {
  await driver.get(BASE_URL)

  const searchInput = await driver.findElement(By.css('input[type="search"]'))
  await searchInput.sendKeys('wallet', Key.TAB)

  await driver.wait(until.elementLocated(By.xpath("//a[contains(@class, 'product-title') and contains(., 'Wallet')]")), 5000)

  const cards = await driver.findElements(By.css('.product-card'))
  assert.equal(cards.length, 1)
})

test('increments cart count when adding item', async () => {
  await driver.get(BASE_URL)

  const cartCounter = await driver.findElement(By.css('.cart-link span'))
  assert.equal(await cartCounter.getText(), '0')

  const firstAddButton = await driver.findElement(By.css('.product-card button'))
  await firstAddButton.click()

  await driver.wait(async () => (await cartCounter.getText()) === '1', 5000)
  assert.equal(await cartCounter.getText(), '1')
})
