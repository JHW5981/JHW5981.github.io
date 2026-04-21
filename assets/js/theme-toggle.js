;(function () {
  var STORAGE_KEY = "preferred-theme"
  var root = document.documentElement
  var button = document.getElementById("theme-toggle-button")
  var darkQuery =
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)")
      : null

  function getStoredTheme() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY)
      return stored === "dark" || stored === "light" ? stored : null
    } catch (e) {
      return null
    }
  }

  function getSystemTheme() {
    return darkQuery && darkQuery.matches ? "dark" : "light"
  }

  function updateButton(theme) {
    if (!button) return
    if (theme === "dark") {
      button.textContent = "☀ Light"
      button.setAttribute("aria-label", "Switch to light mode")
      return
    }

    button.textContent = "🌙 Dark"
    button.setAttribute("aria-label", "Switch to dark mode")
  }

  function applyTheme(theme) {
    root.setAttribute("data-theme", theme)
    updateButton(theme)
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch (e) {
      // Ignore storage failures in private mode.
    }
  }

  function resolveTheme() {
    return getStoredTheme() || getSystemTheme()
  }

  function toggleTheme() {
    var current = root.getAttribute("data-theme") || resolveTheme()
    var nextTheme = current === "dark" ? "light" : "dark"
    persistTheme(nextTheme)
    applyTheme(nextTheme)
  }

  applyTheme(resolveTheme())

  if (button) {
    button.addEventListener("click", toggleTheme)
  }

  if (darkQuery) {
    var onSystemThemeChange = function () {
      if (!getStoredTheme()) {
        applyTheme(getSystemTheme())
      }
    }

    if (typeof darkQuery.addEventListener === "function") {
      darkQuery.addEventListener("change", onSystemThemeChange)
    } else if (typeof darkQuery.addListener === "function") {
      darkQuery.addListener(onSystemThemeChange)
    }
  }
})()
