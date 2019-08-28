import * as webdriver from "selenium-webdriver"
import capabilities from "./capabilities"
import expect from "expect"

declare const ScrollUtility: typeof import("../")

const local_testing_site_url = "http://localhost:8080/"

const duration = 0

for (const os in capabilities) {
  for (const browser in capabilities[os]) {
    const cap: webdriver.Capabilities = capabilities[os][browser]
    describe(`${os} ${browser}`, function(this) {
      let browser: webdriver.WebDriver = (null as any) as webdriver.WebDriver
      before(async function(this) {
        browser = await new webdriver.Builder()
          .usingServer("https://hub-cloud.browserstack.com/wd/hub")
          .withCapabilities(cap)
          .build()
        await browser.get(local_testing_site_url)
        expect(browser).not.toBeNull()
      })
      it("should have ScrollUtility", async function() {
        const scrollUtility = await browser.executeScript(() => {
          return ScrollUtility
        })
        expect(scrollUtility).toBeDefined()
      })
      ;[["html", "#scrollable"], ["#scrollable", "#element"]].forEach(([wrapper, element]) => {
        ;[false, true].forEach(horizontal => {
          describe("scrollTo", () => {
            ;[100, 53.3, 53.5, 53.7, 0].forEach(value => {
              it(`${value}`, async function() {
                await browser.executeScript(
                  (element: string, horizontal: boolean, value: number) => {
                    const scroll = new ScrollUtility.Scroll(element, {
                      horizontal,
                    })
                    scroll.scrollTo(value)
                  },
                  wrapper,
                  horizontal,
                  value,
                )
                await wait(duration + 1)
                const scrollPosition = await browser.executeScript(
                  (wrapper: string, horizontal: boolean) =>
                    ScrollUtility.Misc.getScrollPosition(wrapper, horizontal),
                  wrapper,
                  horizontal,
                )
                expect(scrollPosition).toBe(Math.floor(value))
              })
            })
          })
          describe("center element", () => {
            ;[0, 1, 0.5].forEach(value => {
              it(`should be centered at ${value}`, async function() {
                await browser.executeScript(
                  (wrapper: string, horizontal: boolean, element: HTMLElement) => {
                    new ScrollUtility.Scroll(wrapper, { horizontal }).scrollTo(element, 0.5)
                  },
                  wrapper,
                  horizontal,
                  element,
                )
                await browser.executeScript(
                  (wrapper: string, horizontal: boolean, element: HTMLElement, value: number) => {
                    new ScrollUtility.Scroll(wrapper, { horizontal }).scrollTo(element, value)
                  },
                  wrapper,
                  horizontal,
                  element,
                  value,
                )

                await wait(duration + 1)

                const placement = await browser.executeScript(
                  (wrapper: string, horizontal: boolean, element: HTMLElement) => {
                    return ScrollUtility.Misc.getRelativeElementPosition(
                      wrapper,
                      element,
                      horizontal,
                    )
                  },
                  wrapper,
                  horizontal,
                  element,
                )
                expect(placement).toBeCloseTo(value, 1)
              })
            })
          })
        })
      })
      after(async function() {
        await browser.quit()
      })
    })
  }
}

function wait(duration: number) {
  return new Promise(done => {
    setTimeout(done, duration)
  })
}
