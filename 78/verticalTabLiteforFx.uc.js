// ==UserScript==
// @name           verticalTabLiteforFx.uc.js
// @namespace      http://space.geocities.yahoo.co.jp/gl/alice0775
// @description    CSS入れ替えまくりLiteバージョン
// @include        main
// @compatibility  Firefox 78ESR
// @author         Alice0775
// @note           not support pinned tab yet
// @version        2020/09/15 00:00 78ESR (wip, todo pinned tab)
// @version        2019/10/23 00:00 68ESR fix multiselect mark
// @version        2019/10/22 00:00 68ESR
// ==/UserScript==
"user strict";
verticalTabLiteforFx();
function verticalTabLiteforFx() {
  let verticalTabbar_width = 100;  /* タブバーの横幅 px */
  let verticalTab_height = 18;  /* タブの高さ px */
  /* not yet */
  //let verticalTabPinned_width = 27; /* ピン留めタブの横幅 px */
  //let verticalScrollbar_width = 11; /* スクロールバー幅 px */
  
  var css =`@-moz-document url-prefix("chrome://browser/content/browser.xhtml") {

  /* vertical tabs */
  #tabbrowser-arrowscrollbox {
    max-width: ${verticalTabbar_width}px !important;
  }

  #tabbrowser-tabs {
    height: calc(100vh - 2 * ${verticalTab_height}px) !important;
  }

  .tabbrowser-tab {
    max-height: ${verticalTab_height}px !important;
    font-size: calc(${verticalTab_height}px - 3px) !important;
  }

  .tabbrowser-tab:not([pinned]) {
    width: auto !important;
    transition: none !important;
  }
  
  .tabbrowser-tab::after, .tabbrowser-tab::before {
    border-left: none !important;
  }

  /* put scrollbar at left side */
  #tabbrowser-tabs {
    direction: rtl; /*scroll bar position*/
  }
  .tabbrowser-tab {
    direction: ltr; /*scroll bar position*/
  }
  /* be able to drag scrollbar thumb */
  scrollbox[part] > scrollbar {
    -moz-window-dragging: no-drag;
  }

  /* hide */
  #tabs-newtab-button,
  .titlebar-spacer[type="pre-tabs"],
  .tab-drop-indicator {
    display: none !important;
  }


  /* always show toolbuttons*/
  tabs:not([overflow="true"]):not([hashiddentabs]) ~ #new-tab-button,
  tabs:not([overflow="true"]):not([hashiddentabs]) ~ #alltabs-button {
      display: -moz-box !important;
  }

  /*FullScreen*/
  :root[inFullscreen][inDOMFullscreen] #TabsToolbar {
    display: none;
  }
  :root[inFullscreen]:not([inDOMFullscreen]) #TabsToolbar:not(:hover) {
    max-width: 1px !important;
    opacity: 0;
    transition: .5s;
  }
  :root[inFullscreen]:not([inDOMFullscreen]) #TabsToolbar:hover {
    transition: .2s;
  }
  :root[inFullscreen] #vtb_splitter {
    display: none;
  }

  /*Print Preview*/
  :root[printpreview] #TabsToolbar {
    visibility: collapse;
  }

  /*Popup window*/
  :root[chromehidden*="toolbar"] #TabsToolbar {
    visibility: collapse;
  }

  /* height of menu bar */
  :root:not([tabsintitlebar]) #toolbar-menubar {
    height: 24px;
  }

  /*  */
  :root[tabsintitlebar][Menubarinactive] #titlebar {
     margin-top:-32px;
  }

  /* window control and  drag space */
  :root[tabsintitlebar]:not([Menubarinactive]) #nav-bar .titlebar-buttonbox{
     display: none !important;
  }
  :root:not([inFullscreen])[tabsintitlebar]:not([Menubarinactive]) .titlebar-spacer[type="post-tabs"] {
     display: none !important;
  }
  :root:not([inFullscreen])[tabsintitlebar][Menubarinactive] .titlebar-spacer[type="post-tabs"] {
     display: -moz-box !important;
  }

  :root[inFullscreen]:not([tabsintitlebar]) .titlebar-buttonbox-container,
  :root[inFullscreen]:not([tabsintitlebar]) .titlebar-buttonbox {
      display: none !important;
  }
    
  :root[inFullscreen]:not([tabsintitlebar]) #window-controls {
      display: none;
  }

  :root[inFullscreen] .titlebar-restore {
      display: -moz-box !important;
  }
  :root[inFullscreen] .titlebar-max {
      display: none !important
  }

  `;
  var sss = Cc['@mozilla.org/content/style-sheet-service;1'].getService(Ci.nsIStyleSheetService);
  var uri = makeURI('data:text/css;charset=UTF=8,' + encodeURIComponent(css));
  sss.loadAndRegisterSheet(uri, sss.AGENT_SHEET);


  var tabsToolbar = document.getElementById('TabsToolbar');
  var ref = document.getElementById('SM_toolbox') ||
            document.getElementById('sidebar-box') ||
            document.getElementById("appcontent");
  document.getElementById("browser").insertBefore(tabsToolbar, ref);
  //prepare for splitter
  var vtbSplitter = document.createXULElement("splitter");
  vtbSplitter.setAttribute("id", "vtb_splitter");
  //document.getElementById("browser").insertBefore(vtbSplitter, ref);

  tabsToolbar.setAttribute("orient", "vertical");
  tabsToolbar.querySelector(".toolbar-items").setAttribute("orient", "vertical");
  tabsToolbar.querySelector(".toolbar-items").removeAttribute("align");
  tabsToolbar.querySelector("#TabsToolbar-customization-target").setAttribute("orient", "vertical");

  // scrollbar
  gBrowser.tabContainer.setAttribute("orient", "vertical");
  var arrowScrollbox = gBrowser.tabContainer.arrowScrollbox;
  arrowScrollbox.setAttribute("orient", "vertical");
  var scrollbox = arrowScrollbox.shadowRoot.querySelector("scrollbox");
  scrollbox.setAttribute("orient", "vertical");
  scrollbox.style.setProperty("overflow-y", "auto", "");
  scrollbox.style.setProperty("scrollbar-width", "thin", "");

  // hide scroll buttons
  var scrollButtonUp = arrowScrollbox.shadowRoot.getElementById("scrollbutton-up");
  var scrollButtonDown = arrowScrollbox.shadowRoot.getElementById("scrollbutton-down");
  scrollButtonUp.style.setProperty("display", "none", "");
  scrollButtonDown.style.setProperty("display", "none", "");
  var spacer1 = arrowScrollbox.shadowRoot.querySelector('[part="overflow-start-indicator"]');
  var spacer2 = arrowScrollbox.shadowRoot.querySelector('[part="overflow-start-indicator"]');
  spacer1.style.setProperty("display", "none", "");
  spacer2.style.setProperty("display", "none", "");

  // ignore lock tab width when closing
  gBrowser.tabContainer._lockTabSizing = function (aTab, tabWidth){};

  // print preview
  PrintPreviewListener._toggleAffectedChrome_org = PrintPreviewListener._toggleAffectedChrome;
  PrintPreviewListener._toggleAffectedChrome = function() {
    PrintPreviewListener._toggleAffectedChrome_org();
    if (!gInPrintPreviewMode)
      document.getElementById("main-window").removeAttribute("printpreview");
    else
      document.getElementById("main-window").setAttribute("printpreview", "true");

  };

  // control buttons
  let spacer = tabsToolbar.querySelector('.titlebar-spacer[type="post-tabs"]');
  let accessibility = tabsToolbar.querySelector('.accessibility-indicator');
  let private = tabsToolbar.querySelector('.private-browsing-indicator');
  let control = tabsToolbar.querySelector('.titlebar-buttonbox-container');
  
  ref = document.getElementById("PanelUI-button");
  ref.parentNode.insertBefore(spacer, ref);
  ref.parentNode.insertBefore(accessibility, ref);
  ref.parentNode.insertBefore(private, ref);
  ref.parentNode.insertBefore(control, ref);

  const target = document.getElementById('toolbar-menubar');
  if (!target?.getAttribute("inactive"))
    document.getElementById("main-window").removeAttribute("Menubarinactive");
  else
    document.getElementById("main-window").setAttribute("Menubarinactive", "true");

  verticalTabLiteforFx.observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (!mutation.target?.getAttribute("inactive"))
        document.getElementById("main-window").removeAttribute("Menubarinactive");
      else
        document.getElementById("main-window").setAttribute("Menubarinactive", "true");
    });    
  });
  const config = { attributes: true, attributeFilter: ["inactive", "autohide"]};
  verticalTabLiteforFx.observer.observe(target, config);

  window.addEventListener("unload", function(){
    verticalTabLiteforFx.observer.disconnect();
  }, {once: true});


  gBrowser.tabContainer._getDropEffectForTabDrag = function(event){return "";}; // default "dragover" handler does nothing
  gBrowser.tabContainer.lastVisibleTab = function() {
    var tabs = this.allTabs;
    for (let i = tabs.length - 1; i >= 0; i--){
      if (!tabs[i].hasAttribute("hidden"))
        return i;
    }
    return -1;
  };
  gBrowser.tabContainer.clearDropIndicator = function() {
    var tabs = this.allTabs;
    for (let i = 0, len = tabs.length; i < len; i++){
      let tab_s= tabs[i].style;
      tab_s.removeProperty("box-shadow");
    }
  };
  gBrowser.tabContainer.addEventListener("drop",function(event){this.on_drop(event);},true);
  gBrowser.tabContainer.addEventListener("dragleave",function(event){this.clearDropIndicator(event);},true);
  gBrowser.tabContainer.on_dragover = function(event) {
    this.clearDropIndicator();
    var effects = this._getDropEffectForTabDrag(event);
    event.preventDefault();
    event.stopPropagation();
    if (effects == "link") {
      let tab = this._getDragTargetTab(event, true);
      if (tab) {
        if (!this._dragTime) {
          this._dragTime = Date.now();
        }
        if (Date.now() >= this._dragTime + this._dragOverDelay) {
          this.selectedItem = tab;
        }
        return;
      }
    }
    var newIndex = this._getDropIndex(event, effects == "link");
    if (newIndex == null)
      return;
    if (newIndex < this.allTabs.length) {
      if (this.allTabs[newIndex].pinned)
        this.allTabs[newIndex].style.setProperty("box-shadow","4px 0px 0px 0px #f00 inset","important");
      else
        this.allTabs[newIndex].style.setProperty("box-shadow","0px 2px 0px 0px #f00 inset, 0px -2px 0px 0px #f00","important");
    } else {
      newIndex = gBrowser.tabContainer.lastVisibleTab();
      if (newIndex >= 0)
      if (this.allTabs[newIndex].pinned)
        this.allTabs[newIndex].style.setProperty("box-shadow","-4px 0px 0px 0px #f00 inset","important");
      else
        this.allTabs[newIndex].style.setProperty("box-shadow","0px -2px 0px 0px #f00 inset, 0px 2px 0px 0px #f00","important");
    }
  };
  gBrowser.tabContainer.addEventListener("dragover", gBrowser.tabContainer.on_dragover, true);
  gBrowser.tabContainer._getDropIndex = function(aEvent, isLink) {
    var tabs = this.allTabs;
    for (let i = 0; i < tabs.length; i++){
      if(tabs[i].pinned) {
        if (aEvent.screenX >= tabs[i].screenX &&
            aEvent.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2 &&
            aEvent.screenY >= tabs[i].screenY &&
            aEvent.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height)
          return i;
        if (aEvent.screenX >= tabs[i].screenX + tabs[i].getBoundingClientRect().width / 2 &&
            aEvent.screenX < tabs[i].screenX + tabs[i].getBoundingClientRect().width &&
            aEvent.screenY >= tabs[i].screenY &&
            aEvent.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height)
          return i + 1;
      }
    }
    for (let i = 0; i < tabs.length; i++){
      if(!tabs[i].pinned) {
        if (aEvent.screenY >= tabs[i].screenY &&
            aEvent.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height / 2)
          return i;
        if (aEvent.screenY >= tabs[i].screenY + tabs[i].getBoundingClientRect().height / 2 &&
            aEvent.screenY < tabs[i].screenY + tabs[i].getBoundingClientRect().height)
          return i + 1;
      }
    }
    return tabs.length;
  };

  gBrowser.tabContainer.on_drop = function(event) {
    this.clearDropIndicator();
    var dt = event.dataTransfer;
    var dropEffect = dt.dropEffect;
    var draggedTab;
    let movingTabs;
    if (dt.mozTypesAt(0)[0] == TAB_DROP_TYPE) {
      // tab copy or move
      draggedTab = dt.mozGetDataAt(TAB_DROP_TYPE, 0);
      // not our drop then
      if (!draggedTab) {
        return;
      }
      movingTabs = draggedTab._dragData.movingTabs;
      draggedTab.container._finishGroupSelectedTabs(draggedTab);
    }
    this._tabDropIndicator.hidden = true;
    event.stopPropagation();
    if (draggedTab && dropEffect == "copy") {
      // copy the dropped tab (wherever it's from)
      let newIndex = this._getDropIndex(event, false);
      let draggedTabCopy;
      for (let tab of movingTabs) {
        let newTab = gBrowser.duplicateTab(tab);
        gBrowser.moveTabTo(newTab, newIndex++);
        if (tab == draggedTab) {
          draggedTabCopy = newTab;
        }
      }
      if (draggedTab.container != this || event.shiftKey) {
        this.selectedItem = draggedTabCopy;
      }
    } else if (draggedTab && draggedTab.container == this) {
      let oldTranslateX = Math.round(draggedTab._dragData.translateX);
      let tabWidth = Math.round(draggedTab._dragData.tabWidth);
      let translateOffset = oldTranslateX % tabWidth;
      let newTranslateX = oldTranslateX - translateOffset;
      if (oldTranslateX > 0 && translateOffset > tabWidth / 2) {
          newTranslateX += tabWidth;
      } else if (oldTranslateX < 0 && -translateOffset > tabWidth / 2) {
          newTranslateX -= tabWidth;
      }
      let dropIndex = this._getDropIndex(event, false);
      //  "animDropIndex" in draggedTab._dragData &&
      //  draggedTab._dragData.animDropIndex;
      let incrementDropIndex = true;
      if (dropIndex && dropIndex > movingTabs[0]._tPos) {
          dropIndex--;
          incrementDropIndex = false;
      }
      let animate = gBrowser.animationsEnabled;
      if (oldTranslateX && oldTranslateX != newTranslateX && animate) {
        for (let tab of movingTabs) {
          tab.setAttribute("tabdrop-samewindow", "true");
          tab.style.transform = "translateX(" + newTranslateX + "px)";
          let onTransitionEnd = transitionendEvent => {
            if (
                transitionendEvent.propertyName != "transform" ||
                transitionendEvent.originalTarget != tab
            ) {
              return;
            }
            tab.removeEventListener("transitionend", onTransitionEnd);
            tab.removeAttribute("tabdrop-samewindow");
            this._finishAnimateTabMove();
            if (dropIndex !== false) {
              gBrowser.moveTabTo(tab, dropIndex);
              if (incrementDropIndex) {
                dropIndex++;
              }
            }
            gBrowser.syncThrobberAnimations(tab);
          };
          tab.addEventListener("transitionend", onTransitionEnd);
        }
      } else {
        this._finishAnimateTabMove();
        if (dropIndex !== false) {
          for (let tab of movingTabs) {
            gBrowser.moveTabTo(tab, dropIndex);
            if (incrementDropIndex) {
              dropIndex++;
            }
          }
        }
      }
    } else if (draggedTab) {
      let newIndex = this._getDropIndex(event, false);
      let newTabs = [];
      for (let tab of movingTabs) {
        let newTab = gBrowser.adoptTab(tab, newIndex++, tab == draggedTab);
        newTabs.push(newTab);
      }
      // Restore tab selection
      gBrowser.addRangeToMultiSelectedTabs(
          newTabs[0],
          newTabs[newTabs.length - 1]
      );
    } else {
      // Pass true to disallow dropping javascript: or data: urls
      let links;
      try {
          links = browserDragAndDrop.dropLinks(event, true);
      } catch (ex) {}
      if (!links || links.length === 0) {
          return;
      }
      let inBackground = Services.prefs.getBoolPref(
          "browser.tabs.loadInBackground"
      );
      if (event.shiftKey) {
          inBackground = !inBackground;
      }
      let targetTab = this._getDragTargetTab(event, true);
      let userContextId = this.selectedItem.getAttribute("usercontextid");
      let replace = !!targetTab;
      let newIndex = this._getDropIndex(event, true);
      let urls = links.map(link => link.url);
      let csp = browserDragAndDrop.getCSP(event);
      let triggeringPrincipal = browserDragAndDrop.getTriggeringPrincipal(
          event
      );
      (async () => {
        if (urls.length >=
            Services.prefs.getIntPref("browser.tabs.maxOpenBeforeWarn")
        ) {
          // Sync dialog cannot be used inside drop event handler.
          let answer = await OpenInTabsUtils.promiseConfirmOpenInTabs(
                       urls.length,
                       window
          );
          if (!answer) {
            return;
          }
        }
        gBrowser.loadTabs(urls, {
                          inBackground,
                          replace,
                          allowThirdPartyFixup: true,
                          targetTab,
                          newIndex,
                          userContextId,
                          triggeringPrincipal,
                          csp,
        });
      })();
    }
    if (draggedTab) {
      delete draggedTab._dragData;
    }
  };
  
  gBrowser.tabContainer.addEventListener('SSTabRestoring', ensureVisible, false);
  gBrowser.tabContainer.addEventListener('TabSelect', ensureVisible, false);
  window.addEventListener('resize', ensureVisible, false);
  function ensureVisible(event) {
    let tab = gBrowser.selectedTab;
    let tabContainer = gBrowser.tabContainer;
    if ( tab.screenY + tab.getBoundingClientRect().height + 1 >
           tabContainer.screenY + tabContainer.getBoundingClientRect().height ) {
      tab.scrollIntoView(false);
    } else if ( tab.screenY < tabContainer.screenY ) {
      tab.scrollIntoView(true);
    }
  }

}
