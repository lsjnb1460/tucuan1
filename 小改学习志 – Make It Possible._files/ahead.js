/**
 * @description: 主题[深色/浅色]模式切换
 */
const html = document.getElementsByTagName('html')[0]

let listenMode = (event) => {
  if (event.matches) {
    html.setAttribute('data-theme-mode', 'dark')
  } else {
    html.setAttribute('data-theme-mode', '')
  }
}

let darkMode = window.matchMedia('(prefers-color-scheme: dark)')

function changeMode(themeMode) {
  if (themeMode == 'system') {
    listenMode(darkMode)
    darkMode.addEventListener('change', listenMode)
  } else if (themeMode == 'dark') {
    html.setAttribute('data-theme-mode', 'dark')
    darkMode.removeEventListener('change', listenMode)
  } else {
    html.setAttribute('data-theme-mode', '')
    darkMode.removeEventListener('change', listenMode)
  }
}

let themeMode = localStorage.getItem('themeColor')

changeMode(themeMode)


// 代码块dark模式
let listenCodeMode = (event) => {
  // console.log('监听成功')
  if (event.matches) {
    document.querySelector('link[data-dark]').setAttribute('rel', 'stylesheet preload')
    document.querySelector('link[data-light]').setAttribute('rel', 'alternate stylesheet preload')
  } else {
    document.querySelector('link[data-dark]').setAttribute('rel', 'alternate stylesheet preload')
    document.querySelector('link[data-light]').setAttribute('rel', 'stylesheet preload')
  }
}

function CodeDarkMode() {
  let code_dark_link = document.querySelector('link[data-dark]')
  let code_light_link = document.querySelector('link[data-light]')
  let current_theme_mode = localStorage.getItem('themeColor')

  if(current_theme_mode == 'system') {
    listenCodeMode(darkMode)
    darkMode.addEventListener('change', listenCodeMode)
  } else if (current_theme_mode == 'dark') {
    code_dark_link.setAttribute('rel', 'stylesheet preload')
    code_light_link.setAttribute('rel', 'alternate stylesheet preload')
    darkMode.removeEventListener('change', listenCodeMode)
  } else {
    code_dark_link.setAttribute('rel', 'alternate stylesheet preload')
    code_light_link.setAttribute('rel', 'stylesheet preload')
    darkMode.removeEventListener('change', listenCodeMode)
  }
}

CodeDarkMode()


/**
 * @description: 弹窗通知
 */
function popupNotify(message) {  

  // 清除所有弹窗
  document.querySelectorAll('.notice-popup').forEach((notify) => document.body.removeChild(notify))

  // 判断是否有公告内容
  if (!message) return

  // 初始化弹窗通知
  let notice_message = localStorage.getItem('notice_message')
  let notice_popup = localStorage.getItem('notice_popup')
  let notice_expiration_date = localStorage.getItem('notice_expiration_date')

  if (notice_message === null) {
    localStorage.setItem('notice_message', message)
    notice_message = message
  }

  if (notice_popup === null) {
    localStorage.setItem('notice_popup', 'true')
    notice_popup = 'true'
  }

  if (notice_expiration_date === null) {
    localStorage.setItem('notice_expiration_date', 'false')
  }
  
  // 弹窗功能
  function popup() {
    const html = `
    <div class="notice-popup">
      <div class="popup-content">
        <div class="popup-header">
          <h3>
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-notice-full"></use>
            </svg> <span>网站公告</span>
          </h3>
          <button class="popup-close">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#icon-close-fill"></use>
            </svg>
          </button>
        </div>
        <div class="popup-body">
          <p>${message}</p>
        </div>
        <div class="popup-footer">
          <button class="popup-prevent">我记住啦~</button>
          <button class="popup-close">确认</button>
        </div>
      </div>
    </div>`
    document.body.innerHTML += html
  }
  
  // 判断是否弹窗
  if (notice_message !== message) { // 公告更新时弹窗
    localStorage.setItem('notice_message', message)
    localStorage.setItem('notice_popup', 'true')
    localStorage.setItem('notice_expiration_date', 'false')
    popup()
  } else { 
    if (notice_popup === 'true') { // 弹窗
      popup()
    } else {
      if ((notice_expiration_date - Date.now()) < 0) {
        localStorage.setItem('notice_popup', 'true')
        localStorage.setItem('notice_expiration_date', 'false')
        popup()
      }
    }
  }

  // 关闭弹窗功能
  function close_pop() {
    document.querySelector('.notice-popup').classList.add('close')
    setTimeout(() => {
      document.body.removeChild(document.querySelector('.notice-popup'))
    }, 500)
  }

  // 7天内不再弹出
  const popupPrevent = document.querySelector('.popup-prevent')
  if (popupPrevent) {
    popupPrevent.addEventListener('click', () => {
      localStorage.setItem('notice_popup', 'false')
      localStorage.setItem('notice_expiration_date', Date.now() + (7 * 24 * 60 * 60 * 1000))
      close_pop()
    })
  }

  // 关闭弹窗
  const popupClose = document.querySelectorAll('.popup-close')
  popupClose.forEach((close) => {
    close.addEventListener('click', () => {
      close_pop()
    })
  })
}