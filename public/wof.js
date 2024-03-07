(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // node_modules/howler/dist/howler.js
  var require_howler = __commonJS({
    "node_modules/howler/dist/howler.js"(exports) {
      (function() {
        "use strict";
        var HowlerGlobal2 = function() {
          this.init();
        };
        HowlerGlobal2.prototype = {
          /**
           * Initialize the global Howler object.
           * @return {Howler}
           */
          init: function() {
            var self = this || Howler4;
            self._counter = 1e3;
            self._html5AudioPool = [];
            self.html5PoolSize = 10;
            self._codecs = {};
            self._howls = [];
            self._muted = false;
            self._volume = 1;
            self._canPlayEvent = "canplaythrough";
            self._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
            self.masterGain = null;
            self.noAudio = false;
            self.usingWebAudio = true;
            self.autoSuspend = true;
            self.ctx = null;
            self.autoUnlock = true;
            self._setup();
            return self;
          },
          /**
           * Get/set the global volume for all sounds.
           * @param  {Float} vol Volume from 0.0 to 1.0.
           * @return {Howler/Float}     Returns self or current volume.
           */
          volume: function(vol) {
            var self = this || Howler4;
            vol = parseFloat(vol);
            if (!self.ctx) {
              setupAudioContext();
            }
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              self._volume = vol;
              if (self._muted) {
                return self;
              }
              if (self.usingWebAudio) {
                self.masterGain.gain.setValueAtTime(vol, Howler4.ctx.currentTime);
              }
              for (var i = 0; i < self._howls.length; i++) {
                if (!self._howls[i]._webAudio) {
                  var ids = self._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self._howls[i]._soundById(ids[j]);
                    if (sound && sound._node) {
                      sound._node.volume = sound._volume * vol;
                    }
                  }
                }
              }
              return self;
            }
            return self._volume;
          },
          /**
           * Handle muting and unmuting globally.
           * @param  {Boolean} muted Is muted or not.
           */
          mute: function(muted) {
            var self = this || Howler4;
            if (!self.ctx) {
              setupAudioContext();
            }
            self._muted = muted;
            if (self.usingWebAudio) {
              self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler4.ctx.currentTime);
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.muted = muted ? true : sound._muted;
                  }
                }
              }
            }
            return self;
          },
          /**
           * Handle stopping all sounds globally.
           */
          stop: function() {
            var self = this || Howler4;
            for (var i = 0; i < self._howls.length; i++) {
              self._howls[i].stop();
            }
            return self;
          },
          /**
           * Unload and destroy all currently loaded Howl objects.
           * @return {Howler}
           */
          unload: function() {
            var self = this || Howler4;
            for (var i = self._howls.length - 1; i >= 0; i--) {
              self._howls[i].unload();
            }
            if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== "undefined") {
              self.ctx.close();
              self.ctx = null;
              setupAudioContext();
            }
            return self;
          },
          /**
           * Check for codec support of specific extension.
           * @param  {String} ext Audio file extention.
           * @return {Boolean}
           */
          codecs: function(ext) {
            return (this || Howler4)._codecs[ext.replace(/^x-/, "")];
          },
          /**
           * Setup various state values for global tracking.
           * @return {Howler}
           */
          _setup: function() {
            var self = this || Howler4;
            self.state = self.ctx ? self.ctx.state || "suspended" : "suspended";
            self._autoSuspend();
            if (!self.usingWebAudio) {
              if (typeof Audio !== "undefined") {
                try {
                  var test = new Audio();
                  if (typeof test.oncanplaythrough === "undefined") {
                    self._canPlayEvent = "canplay";
                  }
                } catch (e) {
                  self.noAudio = true;
                }
              } else {
                self.noAudio = true;
              }
            }
            try {
              var test = new Audio();
              if (test.muted) {
                self.noAudio = true;
              }
            } catch (e) {
            }
            if (!self.noAudio) {
              self._setupCodecs();
            }
            return self;
          },
          /**
           * Check for browser support for various codecs and cache the results.
           * @return {Howler}
           */
          _setupCodecs: function() {
            var self = this || Howler4;
            var audioTest = null;
            try {
              audioTest = typeof Audio !== "undefined" ? new Audio() : null;
            } catch (err) {
              return self;
            }
            if (!audioTest || typeof audioTest.canPlayType !== "function") {
              return self;
            }
            var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
            var ua = self._navigator ? self._navigator.userAgent : "";
            var checkOpera = ua.match(/OPR\/(\d+)/g);
            var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
            var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
            var safariVersion = ua.match(/Version\/(.*?) /);
            var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
            self._codecs = {
              mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
              mpeg: !!mpegTest,
              opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
              ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
              aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
              flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
            };
            return self;
          },
          /**
           * Some browsers/devices will only allow audio to be played after a user interaction.
           * Attempt to automatically unlock audio on the first user interaction.
           * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
           * @return {Howler}
           */
          _unlockAudio: function() {
            var self = this || Howler4;
            if (self._audioUnlocked || !self.ctx) {
              return;
            }
            self._audioUnlocked = false;
            self.autoUnlock = false;
            if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
              self._mobileUnloaded = true;
              self.unload();
            }
            self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);
            var unlock = function(e) {
              while (self._html5AudioPool.length < self.html5PoolSize) {
                try {
                  var audioNode = new Audio();
                  audioNode._unlocked = true;
                  self._releaseHtml5Audio(audioNode);
                } catch (e2) {
                  self.noAudio = true;
                  break;
                }
              }
              for (var i = 0; i < self._howls.length; i++) {
                if (!self._howls[i]._webAudio) {
                  var ids = self._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound = self._howls[i]._soundById(ids[j]);
                    if (sound && sound._node && !sound._node._unlocked) {
                      sound._node._unlocked = true;
                      sound._node.load();
                    }
                  }
                }
              }
              self._autoResume();
              var source = self.ctx.createBufferSource();
              source.buffer = self._scratchBuffer;
              source.connect(self.ctx.destination);
              if (typeof source.start === "undefined") {
                source.noteOn(0);
              } else {
                source.start(0);
              }
              if (typeof self.ctx.resume === "function") {
                self.ctx.resume();
              }
              source.onended = function() {
                source.disconnect(0);
                self._audioUnlocked = true;
                document.removeEventListener("touchstart", unlock, true);
                document.removeEventListener("touchend", unlock, true);
                document.removeEventListener("click", unlock, true);
                document.removeEventListener("keydown", unlock, true);
                for (var i2 = 0; i2 < self._howls.length; i2++) {
                  self._howls[i2]._emit("unlock");
                }
              };
            };
            document.addEventListener("touchstart", unlock, true);
            document.addEventListener("touchend", unlock, true);
            document.addEventListener("click", unlock, true);
            document.addEventListener("keydown", unlock, true);
            return self;
          },
          /**
           * Get an unlocked HTML5 Audio object from the pool. If none are left,
           * return a new Audio object and throw a warning.
           * @return {Audio} HTML5 Audio object.
           */
          _obtainHtml5Audio: function() {
            var self = this || Howler4;
            if (self._html5AudioPool.length) {
              return self._html5AudioPool.pop();
            }
            var testPlay = new Audio().play();
            if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
              testPlay.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
              });
            }
            return new Audio();
          },
          /**
           * Return an activated HTML5 Audio object to the pool.
           * @return {Howler}
           */
          _releaseHtml5Audio: function(audio) {
            var self = this || Howler4;
            if (audio._unlocked) {
              self._html5AudioPool.push(audio);
            }
            return self;
          },
          /**
           * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
           * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
           * @return {Howler}
           */
          _autoSuspend: function() {
            var self = this;
            if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === "undefined" || !Howler4.usingWebAudio) {
              return;
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (self._howls[i]._webAudio) {
                for (var j = 0; j < self._howls[i]._sounds.length; j++) {
                  if (!self._howls[i]._sounds[j]._paused) {
                    return self;
                  }
                }
              }
            }
            if (self._suspendTimer) {
              clearTimeout(self._suspendTimer);
            }
            self._suspendTimer = setTimeout(function() {
              if (!self.autoSuspend) {
                return;
              }
              self._suspendTimer = null;
              self.state = "suspending";
              var handleSuspension = function() {
                self.state = "suspended";
                if (self._resumeAfterSuspend) {
                  delete self._resumeAfterSuspend;
                  self._autoResume();
                }
              };
              self.ctx.suspend().then(handleSuspension, handleSuspension);
            }, 3e4);
            return self;
          },
          /**
           * Automatically resume the Web Audio AudioContext when a new sound is played.
           * @return {Howler}
           */
          _autoResume: function() {
            var self = this;
            if (!self.ctx || typeof self.ctx.resume === "undefined" || !Howler4.usingWebAudio) {
              return;
            }
            if (self.state === "running" && self.ctx.state !== "interrupted" && self._suspendTimer) {
              clearTimeout(self._suspendTimer);
              self._suspendTimer = null;
            } else if (self.state === "suspended" || self.state === "running" && self.ctx.state === "interrupted") {
              self.ctx.resume().then(function() {
                self.state = "running";
                for (var i = 0; i < self._howls.length; i++) {
                  self._howls[i]._emit("resume");
                }
              });
              if (self._suspendTimer) {
                clearTimeout(self._suspendTimer);
                self._suspendTimer = null;
              }
            } else if (self.state === "suspending") {
              self._resumeAfterSuspend = true;
            }
            return self;
          }
        };
        var Howler4 = new HowlerGlobal2();
        var Howl4 = function(o) {
          var self = this;
          if (!o.src || o.src.length === 0) {
            console.error("An array of source files must be passed with any new Howl.");
            return;
          }
          self.init(o);
        };
        Howl4.prototype = {
          /**
           * Initialize a new Howl group object.
           * @param  {Object} o Passed in properties for this group.
           * @return {Howl}
           */
          init: function(o) {
            var self = this;
            if (!Howler4.ctx) {
              setupAudioContext();
            }
            self._autoplay = o.autoplay || false;
            self._format = typeof o.format !== "string" ? o.format : [o.format];
            self._html5 = o.html5 || false;
            self._muted = o.mute || false;
            self._loop = o.loop || false;
            self._pool = o.pool || 5;
            self._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
            self._rate = o.rate || 1;
            self._sprite = o.sprite || {};
            self._src = typeof o.src !== "string" ? o.src : [o.src];
            self._volume = o.volume !== void 0 ? o.volume : 1;
            self._xhr = {
              method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
              headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
              withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
            };
            self._duration = 0;
            self._state = "unloaded";
            self._sounds = [];
            self._endTimers = {};
            self._queue = [];
            self._playLock = false;
            self._onend = o.onend ? [{ fn: o.onend }] : [];
            self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
            self._onload = o.onload ? [{ fn: o.onload }] : [];
            self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
            self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
            self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
            self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
            self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
            self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
            self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
            self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
            self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
            self._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
            self._onresume = [];
            self._webAudio = Howler4.usingWebAudio && !self._html5;
            if (typeof Howler4.ctx !== "undefined" && Howler4.ctx && Howler4.autoUnlock) {
              Howler4._unlockAudio();
            }
            Howler4._howls.push(self);
            if (self._autoplay) {
              self._queue.push({
                event: "play",
                action: function() {
                  self.play();
                }
              });
            }
            if (self._preload && self._preload !== "none") {
              self.load();
            }
            return self;
          },
          /**
           * Load the audio file.
           * @return {Howler}
           */
          load: function() {
            var self = this;
            var url = null;
            if (Howler4.noAudio) {
              self._emit("loaderror", null, "No audio support.");
              return;
            }
            if (typeof self._src === "string") {
              self._src = [self._src];
            }
            for (var i = 0; i < self._src.length; i++) {
              var ext, str;
              if (self._format && self._format[i]) {
                ext = self._format[i];
              } else {
                str = self._src[i];
                if (typeof str !== "string") {
                  self._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                  continue;
                }
                ext = /^data:audio\/([^;,]+);/i.exec(str);
                if (!ext) {
                  ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
                }
                if (ext) {
                  ext = ext[1].toLowerCase();
                }
              }
              if (!ext) {
                console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
              }
              if (ext && Howler4.codecs(ext)) {
                url = self._src[i];
                break;
              }
            }
            if (!url) {
              self._emit("loaderror", null, "No codec support for selected audio sources.");
              return;
            }
            self._src = url;
            self._state = "loading";
            if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
              self._html5 = true;
              self._webAudio = false;
            }
            new Sound2(self);
            if (self._webAudio) {
              loadBuffer(self);
            }
            return self;
          },
          /**
           * Play a sound or resume previous playback.
           * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Number}          Sound ID.
           */
          play: function(sprite, internal) {
            var self = this;
            var id = null;
            if (typeof sprite === "number") {
              id = sprite;
              sprite = null;
            } else if (typeof sprite === "string" && self._state === "loaded" && !self._sprite[sprite]) {
              return null;
            } else if (typeof sprite === "undefined") {
              sprite = "__default";
              if (!self._playLock) {
                var num = 0;
                for (var i = 0; i < self._sounds.length; i++) {
                  if (self._sounds[i]._paused && !self._sounds[i]._ended) {
                    num++;
                    id = self._sounds[i]._id;
                  }
                }
                if (num === 1) {
                  sprite = null;
                } else {
                  id = null;
                }
              }
            }
            var sound = id ? self._soundById(id) : self._inactiveSound();
            if (!sound) {
              return null;
            }
            if (id && !sprite) {
              sprite = sound._sprite || "__default";
            }
            if (self._state !== "loaded") {
              sound._sprite = sprite;
              sound._ended = false;
              var soundId = sound._id;
              self._queue.push({
                event: "play",
                action: function() {
                  self.play(soundId);
                }
              });
              return soundId;
            }
            if (id && !sound._paused) {
              if (!internal) {
                self._loadQueue("play");
              }
              return sound._id;
            }
            if (self._webAudio) {
              Howler4._autoResume();
            }
            var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1e3);
            var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3 - seek);
            var timeout = duration * 1e3 / Math.abs(sound._rate);
            var start = self._sprite[sprite][0] / 1e3;
            var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3;
            sound._sprite = sprite;
            sound._ended = false;
            var setParams = function() {
              sound._paused = false;
              sound._seek = seek;
              sound._start = start;
              sound._stop = stop;
              sound._loop = !!(sound._loop || self._sprite[sprite][2]);
            };
            if (seek >= stop) {
              self._ended(sound);
              return;
            }
            var node = sound._node;
            if (self._webAudio) {
              var playWebAudio = function() {
                self._playLock = false;
                setParams();
                self._refreshBuffer(sound);
                var vol = sound._muted || self._muted ? 0 : sound._volume;
                node.gain.setValueAtTime(vol, Howler4.ctx.currentTime);
                sound._playStart = Howler4.ctx.currentTime;
                if (typeof node.bufferSource.start === "undefined") {
                  sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
                } else {
                  sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
                }
                if (timeout !== Infinity) {
                  self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
                }
                if (!internal) {
                  setTimeout(function() {
                    self._emit("play", sound._id);
                    self._loadQueue();
                  }, 0);
                }
              };
              if (Howler4.state === "running" && Howler4.ctx.state !== "interrupted") {
                playWebAudio();
              } else {
                self._playLock = true;
                self.once("resume", playWebAudio);
                self._clearTimer(sound._id);
              }
            } else {
              var playHtml5 = function() {
                node.currentTime = seek;
                node.muted = sound._muted || self._muted || Howler4._muted || node.muted;
                node.volume = sound._volume * Howler4.volume();
                node.playbackRate = sound._rate;
                try {
                  var play = node.play();
                  if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                    self._playLock = true;
                    setParams();
                    play.then(function() {
                      self._playLock = false;
                      node._unlocked = true;
                      if (!internal) {
                        self._emit("play", sound._id);
                      } else {
                        self._loadQueue();
                      }
                    }).catch(function() {
                      self._playLock = false;
                      self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                      sound._ended = true;
                      sound._paused = true;
                    });
                  } else if (!internal) {
                    self._playLock = false;
                    setParams();
                    self._emit("play", sound._id);
                  }
                  node.playbackRate = sound._rate;
                  if (node.paused) {
                    self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    return;
                  }
                  if (sprite !== "__default" || sound._loop) {
                    self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
                  } else {
                    self._endTimers[sound._id] = function() {
                      self._ended(sound);
                      node.removeEventListener("ended", self._endTimers[sound._id], false);
                    };
                    node.addEventListener("ended", self._endTimers[sound._id], false);
                  }
                } catch (err) {
                  self._emit("playerror", sound._id, err);
                }
              };
              if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
                node.src = self._src;
                node.load();
              }
              var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler4._navigator.isCocoonJS;
              if (node.readyState >= 3 || loadedNoReadyState) {
                playHtml5();
              } else {
                self._playLock = true;
                self._state = "loading";
                var listener = function() {
                  self._state = "loaded";
                  playHtml5();
                  node.removeEventListener(Howler4._canPlayEvent, listener, false);
                };
                node.addEventListener(Howler4._canPlayEvent, listener, false);
                self._clearTimer(sound._id);
              }
            }
            return sound._id;
          },
          /**
           * Pause playback and save current position.
           * @param  {Number} id The sound ID (empty to pause all in group).
           * @return {Howl}
           */
          pause: function(id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "pause",
                action: function() {
                  self.pause(id);
                }
              });
              return self;
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self._clearTimer(ids[i]);
              var sound = self._soundById(ids[i]);
              if (sound && !sound._paused) {
                sound._seek = self.seek(ids[i]);
                sound._rateSeek = 0;
                sound._paused = true;
                self._stopFade(ids[i]);
                if (sound._node) {
                  if (self._webAudio) {
                    if (!sound._node.bufferSource) {
                      continue;
                    }
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self._cleanBuffer(sound._node);
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.pause();
                  }
                }
              }
              if (!arguments[1]) {
                self._emit("pause", sound ? sound._id : null);
              }
            }
            return self;
          },
          /**
           * Stop playback and reset to start.
           * @param  {Number} id The sound ID (empty to stop all in group).
           * @param  {Boolean} internal Internal Use: true prevents event firing.
           * @return {Howl}
           */
          stop: function(id, internal) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "stop",
                action: function() {
                  self.stop(id);
                }
              });
              return self;
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self._clearTimer(ids[i]);
              var sound = self._soundById(ids[i]);
              if (sound) {
                sound._seek = sound._start || 0;
                sound._rateSeek = 0;
                sound._paused = true;
                sound._ended = true;
                self._stopFade(ids[i]);
                if (sound._node) {
                  if (self._webAudio) {
                    if (sound._node.bufferSource) {
                      if (typeof sound._node.bufferSource.stop === "undefined") {
                        sound._node.bufferSource.noteOff(0);
                      } else {
                        sound._node.bufferSource.stop(0);
                      }
                      self._cleanBuffer(sound._node);
                    }
                  } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                    sound._node.currentTime = sound._start || 0;
                    sound._node.pause();
                    if (sound._node.duration === Infinity) {
                      self._clearSound(sound._node);
                    }
                  }
                }
                if (!internal) {
                  self._emit("stop", sound._id);
                }
              }
            }
            return self;
          },
          /**
           * Mute/unmute a single sound or all sounds in this Howl group.
           * @param  {Boolean} muted Set to true to mute and false to unmute.
           * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
           * @return {Howl}
           */
          mute: function(muted, id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "mute",
                action: function() {
                  self.mute(muted, id);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              if (typeof muted === "boolean") {
                self._muted = muted;
              } else {
                return self._muted;
              }
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self._soundById(ids[i]);
              if (sound) {
                sound._muted = muted;
                if (sound._interval) {
                  self._stopFade(sound._id);
                }
                if (self._webAudio && sound._node) {
                  sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler4.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.muted = Howler4._muted ? true : muted;
                }
                self._emit("mute", sound._id);
              }
            }
            return self;
          },
          /**
           * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
           *   volume() -> Returns the group's volume value.
           *   volume(id) -> Returns the sound id's current volume.
           *   volume(vol) -> Sets the volume of all sounds in this Howl group.
           *   volume(vol, id) -> Sets the volume of passed sound id.
           * @return {Howl/Number} Returns self or current volume.
           */
          volume: function() {
            var self = this;
            var args = arguments;
            var vol, id;
            if (args.length === 0) {
              return self._volume;
            } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                vol = parseFloat(args[0]);
              }
            } else if (args.length >= 2) {
              vol = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              if (self._state !== "loaded" || self._playLock) {
                self._queue.push({
                  event: "volume",
                  action: function() {
                    self.volume.apply(self, args);
                  }
                });
                return self;
              }
              if (typeof id === "undefined") {
                self._volume = vol;
              }
              id = self._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self._soundById(id[i]);
                if (sound) {
                  sound._volume = vol;
                  if (!args[2]) {
                    self._stopFade(id[i]);
                  }
                  if (self._webAudio && sound._node && !sound._muted) {
                    sound._node.gain.setValueAtTime(vol, Howler4.ctx.currentTime);
                  } else if (sound._node && !sound._muted) {
                    sound._node.volume = vol * Howler4.volume();
                  }
                  self._emit("volume", sound._id);
                }
              }
            } else {
              sound = id ? self._soundById(id) : self._sounds[0];
              return sound ? sound._volume : 0;
            }
            return self;
          },
          /**
           * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id (omit to fade all sounds).
           * @return {Howl}
           */
          fade: function(from, to, len, id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "fade",
                action: function() {
                  self.fade(from, to, len, id);
                }
              });
              return self;
            }
            from = Math.min(Math.max(0, parseFloat(from)), 1);
            to = Math.min(Math.max(0, parseFloat(to)), 1);
            len = parseFloat(len);
            self.volume(from, id);
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound = self._soundById(ids[i]);
              if (sound) {
                if (!id) {
                  self._stopFade(ids[i]);
                }
                if (self._webAudio && !sound._muted) {
                  var currentTime = Howler4.ctx.currentTime;
                  var end = currentTime + len / 1e3;
                  sound._volume = from;
                  sound._node.gain.setValueAtTime(from, currentTime);
                  sound._node.gain.linearRampToValueAtTime(to, end);
                }
                self._startFadeInterval(sound, from, to, len, ids[i], typeof id === "undefined");
              }
            }
            return self;
          },
          /**
           * Starts the internal interval to fade a sound.
           * @param  {Object} sound Reference to sound to fade.
           * @param  {Number} from The value to fade from (0.0 to 1.0).
           * @param  {Number} to   The volume to fade to (0.0 to 1.0).
           * @param  {Number} len  Time in milliseconds to fade.
           * @param  {Number} id   The sound id to fade.
           * @param  {Boolean} isGroup   If true, set the volume on the group.
           */
          _startFadeInterval: function(sound, from, to, len, id, isGroup) {
            var self = this;
            var vol = from;
            var diff = to - from;
            var steps = Math.abs(diff / 0.01);
            var stepLen = Math.max(4, steps > 0 ? len / steps : len);
            var lastTick = Date.now();
            sound._fadeTo = to;
            sound._interval = setInterval(function() {
              var tick = (Date.now() - lastTick) / len;
              lastTick = Date.now();
              vol += diff * tick;
              vol = Math.round(vol * 100) / 100;
              if (diff < 0) {
                vol = Math.max(to, vol);
              } else {
                vol = Math.min(to, vol);
              }
              if (self._webAudio) {
                sound._volume = vol;
              } else {
                self.volume(vol, sound._id, true);
              }
              if (isGroup) {
                self._volume = vol;
              }
              if (to < from && vol <= to || to > from && vol >= to) {
                clearInterval(sound._interval);
                sound._interval = null;
                sound._fadeTo = null;
                self.volume(to, sound._id);
                self._emit("fade", sound._id);
              }
            }, stepLen);
          },
          /**
           * Internal method that stops the currently playing fade when
           * a new fade starts, volume is changed or the sound is stopped.
           * @param  {Number} id The sound id.
           * @return {Howl}
           */
          _stopFade: function(id) {
            var self = this;
            var sound = self._soundById(id);
            if (sound && sound._interval) {
              if (self._webAudio) {
                sound._node.gain.cancelScheduledValues(Howler4.ctx.currentTime);
              }
              clearInterval(sound._interval);
              sound._interval = null;
              self.volume(sound._fadeTo, id);
              sound._fadeTo = null;
              self._emit("fade", id);
            }
            return self;
          },
          /**
           * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
           *   loop() -> Returns the group's loop value.
           *   loop(id) -> Returns the sound id's loop value.
           *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
           *   loop(loop, id) -> Sets the loop value of passed sound id.
           * @return {Howl/Boolean} Returns self or current loop value.
           */
          loop: function() {
            var self = this;
            var args = arguments;
            var loop, id, sound;
            if (args.length === 0) {
              return self._loop;
            } else if (args.length === 1) {
              if (typeof args[0] === "boolean") {
                loop = args[0];
                self._loop = loop;
              } else {
                sound = self._soundById(parseInt(args[0], 10));
                return sound ? sound._loop : false;
              }
            } else if (args.length === 2) {
              loop = args[0];
              id = parseInt(args[1], 10);
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              sound = self._soundById(ids[i]);
              if (sound) {
                sound._loop = loop;
                if (self._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.loop = loop;
                  if (loop) {
                    sound._node.bufferSource.loopStart = sound._start || 0;
                    sound._node.bufferSource.loopEnd = sound._stop;
                    if (self.playing(ids[i])) {
                      self.pause(ids[i], true);
                      self.play(ids[i], true);
                    }
                  }
                }
              }
            }
            return self;
          },
          /**
           * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   rate() -> Returns the first sound node's current playback rate.
           *   rate(id) -> Returns the sound id's current playback rate.
           *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
           *   rate(rate, id) -> Sets the playback rate of passed sound id.
           * @return {Howl/Number} Returns self or the current playback rate.
           */
          rate: function() {
            var self = this;
            var args = arguments;
            var rate, id;
            if (args.length === 0) {
              id = self._sounds[0]._id;
            } else if (args.length === 1) {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                rate = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              rate = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound;
            if (typeof rate === "number") {
              if (self._state !== "loaded" || self._playLock) {
                self._queue.push({
                  event: "rate",
                  action: function() {
                    self.rate.apply(self, args);
                  }
                });
                return self;
              }
              if (typeof id === "undefined") {
                self._rate = rate;
              }
              id = self._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound = self._soundById(id[i]);
                if (sound) {
                  if (self.playing(id[i])) {
                    sound._rateSeek = self.seek(id[i]);
                    sound._playStart = self._webAudio ? Howler4.ctx.currentTime : sound._playStart;
                  }
                  sound._rate = rate;
                  if (self._webAudio && sound._node && sound._node.bufferSource) {
                    sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler4.ctx.currentTime);
                  } else if (sound._node) {
                    sound._node.playbackRate = rate;
                  }
                  var seek = self.seek(id[i]);
                  var duration = (self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1e3 - seek;
                  var timeout = duration * 1e3 / Math.abs(sound._rate);
                  if (self._endTimers[id[i]] || !sound._paused) {
                    self._clearTimer(id[i]);
                    self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
                  }
                  self._emit("rate", sound._id);
                }
              }
            } else {
              sound = self._soundById(id);
              return sound ? sound._rate : self._rate;
            }
            return self;
          },
          /**
           * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
           *   seek() -> Returns the first sound node's current seek position.
           *   seek(id) -> Returns the sound id's current seek position.
           *   seek(seek) -> Sets the seek position of the first sound node.
           *   seek(seek, id) -> Sets the seek position of passed sound id.
           * @return {Howl/Number} Returns self or the current seek position.
           */
          seek: function() {
            var self = this;
            var args = arguments;
            var seek, id;
            if (args.length === 0) {
              if (self._sounds.length) {
                id = self._sounds[0]._id;
              }
            } else if (args.length === 1) {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else if (self._sounds.length) {
                id = self._sounds[0]._id;
                seek = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              seek = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            if (typeof id === "undefined") {
              return 0;
            }
            if (typeof seek === "number" && (self._state !== "loaded" || self._playLock)) {
              self._queue.push({
                event: "seek",
                action: function() {
                  self.seek.apply(self, args);
                }
              });
              return self;
            }
            var sound = self._soundById(id);
            if (sound) {
              if (typeof seek === "number" && seek >= 0) {
                var playing = self.playing(id);
                if (playing) {
                  self.pause(id, true);
                }
                sound._seek = seek;
                sound._ended = false;
                self._clearTimer(id);
                if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
                  sound._node.currentTime = seek;
                }
                var seekAndEmit = function() {
                  if (playing) {
                    self.play(id, true);
                  }
                  self._emit("seek", id);
                };
                if (playing && !self._webAudio) {
                  var emitSeek = function() {
                    if (!self._playLock) {
                      seekAndEmit();
                    } else {
                      setTimeout(emitSeek, 0);
                    }
                  };
                  setTimeout(emitSeek, 0);
                } else {
                  seekAndEmit();
                }
              } else {
                if (self._webAudio) {
                  var realTime = self.playing(id) ? Howler4.ctx.currentTime - sound._playStart : 0;
                  var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                  return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
                } else {
                  return sound._node.currentTime;
                }
              }
            }
            return self;
          },
          /**
           * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
           * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
           * @return {Boolean} True if playing and false if not.
           */
          playing: function(id) {
            var self = this;
            if (typeof id === "number") {
              var sound = self._soundById(id);
              return sound ? !sound._paused : false;
            }
            for (var i = 0; i < self._sounds.length; i++) {
              if (!self._sounds[i]._paused) {
                return true;
              }
            }
            return false;
          },
          /**
           * Get the duration of this sound. Passing a sound id will return the sprite duration.
           * @param  {Number} id The sound id to check. If none is passed, return full source duration.
           * @return {Number} Audio duration in seconds.
           */
          duration: function(id) {
            var self = this;
            var duration = self._duration;
            var sound = self._soundById(id);
            if (sound) {
              duration = self._sprite[sound._sprite][1] / 1e3;
            }
            return duration;
          },
          /**
           * Returns the current loaded state of this Howl.
           * @return {String} 'unloaded', 'loading', 'loaded'
           */
          state: function() {
            return this._state;
          },
          /**
           * Unload and destroy the current Howl object.
           * This will immediately stop all sound instances attached to this group.
           */
          unload: function() {
            var self = this;
            var sounds = self._sounds;
            for (var i = 0; i < sounds.length; i++) {
              if (!sounds[i]._paused) {
                self.stop(sounds[i]._id);
              }
              if (!self._webAudio) {
                self._clearSound(sounds[i]._node);
                sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
                sounds[i]._node.removeEventListener(Howler4._canPlayEvent, sounds[i]._loadFn, false);
                sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
                Howler4._releaseHtml5Audio(sounds[i]._node);
              }
              delete sounds[i]._node;
              self._clearTimer(sounds[i]._id);
            }
            var index = Howler4._howls.indexOf(self);
            if (index >= 0) {
              Howler4._howls.splice(index, 1);
            }
            var remCache = true;
            for (i = 0; i < Howler4._howls.length; i++) {
              if (Howler4._howls[i]._src === self._src || self._src.indexOf(Howler4._howls[i]._src) >= 0) {
                remCache = false;
                break;
              }
            }
            if (cache && remCache) {
              delete cache[self._src];
            }
            Howler4.noAudio = false;
            self._state = "unloaded";
            self._sounds = [];
            self = null;
            return null;
          },
          /**
           * Listen to a custom event.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
           * @return {Howl}
           */
          on: function(event, fn, id, once) {
            var self = this;
            var events = self["_on" + event];
            if (typeof fn === "function") {
              events.push(once ? { id, fn, once } : { id, fn });
            }
            return self;
          },
          /**
           * Remove a custom event. Call without parameters to remove all events.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to remove. Leave empty to remove all.
           * @param  {Number}   id    (optional) Only remove events for this sound.
           * @return {Howl}
           */
          off: function(event, fn, id) {
            var self = this;
            var events = self["_on" + event];
            var i = 0;
            if (typeof fn === "number") {
              id = fn;
              fn = null;
            }
            if (fn || id) {
              for (i = 0; i < events.length; i++) {
                var isId = id === events[i].id;
                if (fn === events[i].fn && isId || !fn && isId) {
                  events.splice(i, 1);
                  break;
                }
              }
            } else if (event) {
              self["_on" + event] = [];
            } else {
              var keys = Object.keys(self);
              for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("_on") === 0 && Array.isArray(self[keys[i]])) {
                  self[keys[i]] = [];
                }
              }
            }
            return self;
          },
          /**
           * Listen to a custom event and remove it once fired.
           * @param  {String}   event Event name.
           * @param  {Function} fn    Listener to call.
           * @param  {Number}   id    (optional) Only listen to events for this sound.
           * @return {Howl}
           */
          once: function(event, fn, id) {
            var self = this;
            self.on(event, fn, id, 1);
            return self;
          },
          /**
           * Emit all events of a specific type and pass the sound id.
           * @param  {String} event Event name.
           * @param  {Number} id    Sound ID.
           * @param  {Number} msg   Message to go with event.
           * @return {Howl}
           */
          _emit: function(event, id, msg) {
            var self = this;
            var events = self["_on" + event];
            for (var i = events.length - 1; i >= 0; i--) {
              if (!events[i].id || events[i].id === id || event === "load") {
                setTimeout(function(fn) {
                  fn.call(this, id, msg);
                }.bind(self, events[i].fn), 0);
                if (events[i].once) {
                  self.off(event, events[i].fn, events[i].id);
                }
              }
            }
            self._loadQueue(event);
            return self;
          },
          /**
           * Queue of actions initiated before the sound has loaded.
           * These will be called in sequence, with the next only firing
           * after the previous has finished executing (even if async like play).
           * @return {Howl}
           */
          _loadQueue: function(event) {
            var self = this;
            if (self._queue.length > 0) {
              var task = self._queue[0];
              if (task.event === event) {
                self._queue.shift();
                self._loadQueue();
              }
              if (!event) {
                task.action();
              }
            }
            return self;
          },
          /**
           * Fired when playback ends at the end of the duration.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _ended: function(sound) {
            var self = this;
            var sprite = sound._sprite;
            if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
              setTimeout(self._ended.bind(self, sound), 100);
              return self;
            }
            var loop = !!(sound._loop || self._sprite[sprite][2]);
            self._emit("end", sound._id);
            if (!self._webAudio && loop) {
              self.stop(sound._id, true).play(sound._id);
            }
            if (self._webAudio && loop) {
              self._emit("play", sound._id);
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._playStart = Howler4.ctx.currentTime;
              var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            }
            if (self._webAudio && !loop) {
              sound._paused = true;
              sound._ended = true;
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              self._clearTimer(sound._id);
              self._cleanBuffer(sound._node);
              Howler4._autoSuspend();
            }
            if (!self._webAudio && !loop) {
              self.stop(sound._id, true);
            }
            return self;
          },
          /**
           * Clear the end timer for a sound playback.
           * @param  {Number} id The sound ID.
           * @return {Howl}
           */
          _clearTimer: function(id) {
            var self = this;
            if (self._endTimers[id]) {
              if (typeof self._endTimers[id] !== "function") {
                clearTimeout(self._endTimers[id]);
              } else {
                var sound = self._soundById(id);
                if (sound && sound._node) {
                  sound._node.removeEventListener("ended", self._endTimers[id], false);
                }
              }
              delete self._endTimers[id];
            }
            return self;
          },
          /**
           * Return the sound identified by this ID, or return null.
           * @param  {Number} id Sound ID
           * @return {Object}    Sound object or null.
           */
          _soundById: function(id) {
            var self = this;
            for (var i = 0; i < self._sounds.length; i++) {
              if (id === self._sounds[i]._id) {
                return self._sounds[i];
              }
            }
            return null;
          },
          /**
           * Return an inactive sound from the pool or create a new one.
           * @return {Sound} Sound playback object.
           */
          _inactiveSound: function() {
            var self = this;
            self._drain();
            for (var i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._ended) {
                return self._sounds[i].reset();
              }
            }
            return new Sound2(self);
          },
          /**
           * Drain excess inactive sounds from the pool.
           */
          _drain: function() {
            var self = this;
            var limit = self._pool;
            var cnt = 0;
            var i = 0;
            if (self._sounds.length < limit) {
              return;
            }
            for (i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._ended) {
                cnt++;
              }
            }
            for (i = self._sounds.length - 1; i >= 0; i--) {
              if (cnt <= limit) {
                return;
              }
              if (self._sounds[i]._ended) {
                if (self._webAudio && self._sounds[i]._node) {
                  self._sounds[i]._node.disconnect(0);
                }
                self._sounds.splice(i, 1);
                cnt--;
              }
            }
          },
          /**
           * Get all ID's from the sounds pool.
           * @param  {Number} id Only return one ID if one is passed.
           * @return {Array}    Array of IDs.
           */
          _getSoundIds: function(id) {
            var self = this;
            if (typeof id === "undefined") {
              var ids = [];
              for (var i = 0; i < self._sounds.length; i++) {
                ids.push(self._sounds[i]._id);
              }
              return ids;
            } else {
              return [id];
            }
          },
          /**
           * Load the sound back into the buffer source.
           * @param  {Sound} sound The sound object to work with.
           * @return {Howl}
           */
          _refreshBuffer: function(sound) {
            var self = this;
            sound._node.bufferSource = Howler4.ctx.createBufferSource();
            sound._node.bufferSource.buffer = cache[self._src];
            if (sound._panner) {
              sound._node.bufferSource.connect(sound._panner);
            } else {
              sound._node.bufferSource.connect(sound._node);
            }
            sound._node.bufferSource.loop = sound._loop;
            if (sound._loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop || 0;
            }
            sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler4.ctx.currentTime);
            return self;
          },
          /**
           * Prevent memory leaks by cleaning up the buffer source after playback.
           * @param  {Object} node Sound's audio node containing the buffer source.
           * @return {Howl}
           */
          _cleanBuffer: function(node) {
            var self = this;
            var isIOS = Howler4._navigator && Howler4._navigator.vendor.indexOf("Apple") >= 0;
            if (!node.bufferSource) {
              return self;
            }
            if (Howler4._scratchBuffer && node.bufferSource) {
              node.bufferSource.onended = null;
              node.bufferSource.disconnect(0);
              if (isIOS) {
                try {
                  node.bufferSource.buffer = Howler4._scratchBuffer;
                } catch (e) {
                }
              }
            }
            node.bufferSource = null;
            return self;
          },
          /**
           * Set the source to a 0-second silence to stop any downloading (except in IE).
           * @param  {Object} node Audio node to clear.
           */
          _clearSound: function(node) {
            var checkIE = /MSIE |Trident\//.test(Howler4._navigator && Howler4._navigator.userAgent);
            if (!checkIE) {
              node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            }
          }
        };
        var Sound2 = function(howl) {
          this._parent = howl;
          this.init();
        };
        Sound2.prototype = {
          /**
           * Initialize a new Sound object.
           * @return {Sound}
           */
          init: function() {
            var self = this;
            var parent = self._parent;
            self._muted = parent._muted;
            self._loop = parent._loop;
            self._volume = parent._volume;
            self._rate = parent._rate;
            self._seek = 0;
            self._paused = true;
            self._ended = true;
            self._sprite = "__default";
            self._id = ++Howler4._counter;
            parent._sounds.push(self);
            self.create();
            return self;
          },
          /**
           * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
           * @return {Sound}
           */
          create: function() {
            var self = this;
            var parent = self._parent;
            var volume = Howler4._muted || self._muted || self._parent._muted ? 0 : self._volume;
            if (parent._webAudio) {
              self._node = typeof Howler4.ctx.createGain === "undefined" ? Howler4.ctx.createGainNode() : Howler4.ctx.createGain();
              self._node.gain.setValueAtTime(volume, Howler4.ctx.currentTime);
              self._node.paused = true;
              self._node.connect(Howler4.masterGain);
            } else if (!Howler4.noAudio) {
              self._node = Howler4._obtainHtml5Audio();
              self._errorFn = self._errorListener.bind(self);
              self._node.addEventListener("error", self._errorFn, false);
              self._loadFn = self._loadListener.bind(self);
              self._node.addEventListener(Howler4._canPlayEvent, self._loadFn, false);
              self._endFn = self._endListener.bind(self);
              self._node.addEventListener("ended", self._endFn, false);
              self._node.src = parent._src;
              self._node.preload = parent._preload === true ? "auto" : parent._preload;
              self._node.volume = volume * Howler4.volume();
              self._node.load();
            }
            return self;
          },
          /**
           * Reset the parameters of this sound to the original state (for recycle).
           * @return {Sound}
           */
          reset: function() {
            var self = this;
            var parent = self._parent;
            self._muted = parent._muted;
            self._loop = parent._loop;
            self._volume = parent._volume;
            self._rate = parent._rate;
            self._seek = 0;
            self._rateSeek = 0;
            self._paused = true;
            self._ended = true;
            self._sprite = "__default";
            self._id = ++Howler4._counter;
            return self;
          },
          /**
           * HTML5 Audio error listener callback.
           */
          _errorListener: function() {
            var self = this;
            self._parent._emit("loaderror", self._id, self._node.error ? self._node.error.code : 0);
            self._node.removeEventListener("error", self._errorFn, false);
          },
          /**
           * HTML5 Audio canplaythrough listener callback.
           */
          _loadListener: function() {
            var self = this;
            var parent = self._parent;
            parent._duration = Math.ceil(self._node.duration * 10) / 10;
            if (Object.keys(parent._sprite).length === 0) {
              parent._sprite = { __default: [0, parent._duration * 1e3] };
            }
            if (parent._state !== "loaded") {
              parent._state = "loaded";
              parent._emit("load");
              parent._loadQueue();
            }
            self._node.removeEventListener(Howler4._canPlayEvent, self._loadFn, false);
          },
          /**
           * HTML5 Audio ended listener callback.
           */
          _endListener: function() {
            var self = this;
            var parent = self._parent;
            if (parent._duration === Infinity) {
              parent._duration = Math.ceil(self._node.duration * 10) / 10;
              if (parent._sprite.__default[1] === Infinity) {
                parent._sprite.__default[1] = parent._duration * 1e3;
              }
              parent._ended(self);
            }
            self._node.removeEventListener("ended", self._endFn, false);
          }
        };
        var cache = {};
        var loadBuffer = function(self) {
          var url = self._src;
          if (cache[url]) {
            self._duration = cache[url].duration;
            loadSound(self);
            return;
          }
          if (/^data:[^;]+;base64,/.test(url)) {
            var data = atob(url.split(",")[1]);
            var dataView = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
              dataView[i] = data.charCodeAt(i);
            }
            decodeAudioData(dataView.buffer, self);
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open(self._xhr.method, url, true);
            xhr.withCredentials = self._xhr.withCredentials;
            xhr.responseType = "arraybuffer";
            if (self._xhr.headers) {
              Object.keys(self._xhr.headers).forEach(function(key) {
                xhr.setRequestHeader(key, self._xhr.headers[key]);
              });
            }
            xhr.onload = function() {
              var code = (xhr.status + "")[0];
              if (code !== "0" && code !== "2" && code !== "3") {
                self._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
                return;
              }
              decodeAudioData(xhr.response, self);
            };
            xhr.onerror = function() {
              if (self._webAudio) {
                self._html5 = true;
                self._webAudio = false;
                self._sounds = [];
                delete cache[url];
                self.load();
              }
            };
            safeXhrSend(xhr);
          }
        };
        var safeXhrSend = function(xhr) {
          try {
            xhr.send();
          } catch (e) {
            xhr.onerror();
          }
        };
        var decodeAudioData = function(arraybuffer, self) {
          var error = function() {
            self._emit("loaderror", null, "Decoding audio data failed.");
          };
          var success = function(buffer) {
            if (buffer && self._sounds.length > 0) {
              cache[self._src] = buffer;
              loadSound(self, buffer);
            } else {
              error();
            }
          };
          if (typeof Promise !== "undefined" && Howler4.ctx.decodeAudioData.length === 1) {
            Howler4.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
          } else {
            Howler4.ctx.decodeAudioData(arraybuffer, success, error);
          }
        };
        var loadSound = function(self, buffer) {
          if (buffer && !self._duration) {
            self._duration = buffer.duration;
          }
          if (Object.keys(self._sprite).length === 0) {
            self._sprite = { __default: [0, self._duration * 1e3] };
          }
          if (self._state !== "loaded") {
            self._state = "loaded";
            self._emit("load");
            self._loadQueue();
          }
        };
        var setupAudioContext = function() {
          if (!Howler4.usingWebAudio) {
            return;
          }
          try {
            if (typeof AudioContext !== "undefined") {
              Howler4.ctx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
              Howler4.ctx = new webkitAudioContext();
            } else {
              Howler4.usingWebAudio = false;
            }
          } catch (e) {
            Howler4.usingWebAudio = false;
          }
          if (!Howler4.ctx) {
            Howler4.usingWebAudio = false;
          }
          var iOS = /iP(hone|od|ad)/.test(Howler4._navigator && Howler4._navigator.platform);
          var appVersion = Howler4._navigator && Howler4._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          var version = appVersion ? parseInt(appVersion[1], 10) : null;
          if (iOS && version && version < 9) {
            var safari = /safari/.test(Howler4._navigator && Howler4._navigator.userAgent.toLowerCase());
            if (Howler4._navigator && !safari) {
              Howler4.usingWebAudio = false;
            }
          }
          if (Howler4.usingWebAudio) {
            Howler4.masterGain = typeof Howler4.ctx.createGain === "undefined" ? Howler4.ctx.createGainNode() : Howler4.ctx.createGain();
            Howler4.masterGain.gain.setValueAtTime(Howler4._muted ? 0 : Howler4._volume, Howler4.ctx.currentTime);
            Howler4.masterGain.connect(Howler4.ctx.destination);
          }
          Howler4._setup();
        };
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return {
              Howler: Howler4,
              Howl: Howl4
            };
          });
        }
        if (typeof exports !== "undefined") {
          exports.Howler = Howler4;
          exports.Howl = Howl4;
        }
        if (typeof global !== "undefined") {
          global.HowlerGlobal = HowlerGlobal2;
          global.Howler = Howler4;
          global.Howl = Howl4;
          global.Sound = Sound2;
        } else if (typeof window !== "undefined") {
          window.HowlerGlobal = HowlerGlobal2;
          window.Howler = Howler4;
          window.Howl = Howl4;
          window.Sound = Sound2;
        }
      })();
      (function() {
        "use strict";
        HowlerGlobal.prototype._pos = [0, 0, 0];
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
        HowlerGlobal.prototype.stereo = function(pan) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          for (var i = self._howls.length - 1; i >= 0; i--) {
            self._howls[i].stereo(pan);
          }
          return self;
        };
        HowlerGlobal.prototype.pos = function(x, y, z) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          y = typeof y !== "number" ? self._pos[1] : y;
          z = typeof z !== "number" ? self._pos[2] : z;
          if (typeof x === "number") {
            self._pos = [x, y, z];
            if (typeof self.ctx.listener.positionX !== "undefined") {
              self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
              self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
              self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
            } else {
              self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
            }
          } else {
            return self._pos;
          }
          return self;
        };
        HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          var or = self._orientation;
          y = typeof y !== "number" ? or[1] : y;
          z = typeof z !== "number" ? or[2] : z;
          xUp = typeof xUp !== "number" ? or[3] : xUp;
          yUp = typeof yUp !== "number" ? or[4] : yUp;
          zUp = typeof zUp !== "number" ? or[5] : zUp;
          if (typeof x === "number") {
            self._orientation = [x, y, z, xUp, yUp, zUp];
            if (typeof self.ctx.listener.forwardX !== "undefined") {
              self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
            } else {
              self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
            }
          } else {
            return or;
          }
          return self;
        };
        Howl.prototype.init = /* @__PURE__ */ function(_super) {
          return function(o) {
            var self = this;
            self._orientation = o.orientation || [1, 0, 0];
            self._stereo = o.stereo || null;
            self._pos = o.pos || null;
            self._pannerAttr = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
            };
            self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
            self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
            self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
            return _super.call(this, o);
          };
        }(Howl.prototype.init);
        Howl.prototype.stereo = function(pan, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "stereo",
              action: function() {
                self.stereo(pan, id);
              }
            });
            return self;
          }
          var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
          if (typeof id === "undefined") {
            if (typeof pan === "number") {
              self._stereo = pan;
              self._pos = [pan, 0, 0];
            } else {
              return self._stereo;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (typeof pan === "number") {
                sound._stereo = pan;
                sound._pos = [pan, 0, 0];
                if (sound._node) {
                  sound._pannerAttr.panningModel = "equalpower";
                  if (!sound._panner || !sound._panner.pan) {
                    setupPanner(sound, pannerType);
                  }
                  if (pannerType === "spatial") {
                    if (typeof sound._panner.positionX !== "undefined") {
                      sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                      sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                      sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                    } else {
                      sound._panner.setPosition(pan, 0, 0);
                    }
                  } else {
                    sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                  }
                }
                self._emit("stereo", sound._id);
              } else {
                return sound._stereo;
              }
            }
          }
          return self;
        };
        Howl.prototype.pos = function(x, y, z, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "pos",
              action: function() {
                self.pos(x, y, z, id);
              }
            });
            return self;
          }
          y = typeof y !== "number" ? 0 : y;
          z = typeof z !== "number" ? -0.5 : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self._pos = [x, y, z];
            } else {
              return self._pos;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (typeof x === "number") {
                sound._pos = [x, y, z];
                if (sound._node) {
                  if (!sound._panner || sound._panner.pan) {
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(x, y, z);
                  }
                }
                self._emit("pos", sound._id);
              } else {
                return sound._pos;
              }
            }
          }
          return self;
        };
        Howl.prototype.orientation = function(x, y, z, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "orientation",
              action: function() {
                self.orientation(x, y, z, id);
              }
            });
            return self;
          }
          y = typeof y !== "number" ? self._orientation[1] : y;
          z = typeof z !== "number" ? self._orientation[2] : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self._orientation = [x, y, z];
            } else {
              return self._orientation;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (typeof x === "number") {
                sound._orientation = [x, y, z];
                if (sound._node) {
                  if (!sound._panner) {
                    if (!sound._pos) {
                      sound._pos = self._pos || [0, 0, -0.5];
                    }
                    setupPanner(sound, "spatial");
                  }
                  if (typeof sound._panner.orientationX !== "undefined") {
                    sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setOrientation(x, y, z);
                  }
                }
                self._emit("orientation", sound._id);
              } else {
                return sound._orientation;
              }
            }
          }
          return self;
        };
        Howl.prototype.pannerAttr = function() {
          var self = this;
          var args = arguments;
          var o, id, sound;
          if (!self._webAudio) {
            return self;
          }
          if (args.length === 0) {
            return self._pannerAttr;
          } else if (args.length === 1) {
            if (typeof args[0] === "object") {
              o = args[0];
              if (typeof id === "undefined") {
                if (!o.pannerAttr) {
                  o.pannerAttr = {
                    coneInnerAngle: o.coneInnerAngle,
                    coneOuterAngle: o.coneOuterAngle,
                    coneOuterGain: o.coneOuterGain,
                    distanceModel: o.distanceModel,
                    maxDistance: o.maxDistance,
                    refDistance: o.refDistance,
                    rolloffFactor: o.rolloffFactor,
                    panningModel: o.panningModel
                  };
                }
                self._pannerAttr = {
                  coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
                  coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
                  coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
                  distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self._distanceModel,
                  maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self._maxDistance,
                  refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self._refDistance,
                  rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
                  panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self._panningModel
                };
              }
            } else {
              sound = self._soundById(parseInt(args[0], 10));
              return sound ? sound._pannerAttr : self._pannerAttr;
            }
          } else if (args.length === 2) {
            o = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self._soundById(ids[i]);
            if (sound) {
              var pa = sound._pannerAttr;
              pa = {
                coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
                coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
                coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
                distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
                maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
                refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
                rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
                panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
              };
              var panner = sound._panner;
              if (!panner) {
                if (!sound._pos) {
                  sound._pos = self._pos || [0, 0, -0.5];
                }
                setupPanner(sound, "spatial");
                panner = sound._panner;
              }
              panner.coneInnerAngle = pa.coneInnerAngle;
              panner.coneOuterAngle = pa.coneOuterAngle;
              panner.coneOuterGain = pa.coneOuterGain;
              panner.distanceModel = pa.distanceModel;
              panner.maxDistance = pa.maxDistance;
              panner.refDistance = pa.refDistance;
              panner.rolloffFactor = pa.rolloffFactor;
              panner.panningModel = pa.panningModel;
            }
          }
          return self;
        };
        Sound.prototype.init = /* @__PURE__ */ function(_super) {
          return function() {
            var self = this;
            var parent = self._parent;
            self._orientation = parent._orientation;
            self._stereo = parent._stereo;
            self._pos = parent._pos;
            self._pannerAttr = parent._pannerAttr;
            _super.call(this);
            if (self._stereo) {
              parent.stereo(self._stereo);
            } else if (self._pos) {
              parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
            }
          };
        }(Sound.prototype.init);
        Sound.prototype.reset = /* @__PURE__ */ function(_super) {
          return function() {
            var self = this;
            var parent = self._parent;
            self._orientation = parent._orientation;
            self._stereo = parent._stereo;
            self._pos = parent._pos;
            self._pannerAttr = parent._pannerAttr;
            if (self._stereo) {
              parent.stereo(self._stereo);
            } else if (self._pos) {
              parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
            } else if (self._panner) {
              self._panner.disconnect(0);
              self._panner = void 0;
              parent._refreshBuffer(self);
            }
            return _super.call(this);
          };
        }(Sound.prototype.reset);
        var setupPanner = function(sound, type) {
          type = type || "spatial";
          if (type === "spatial") {
            sound._panner = Howler.ctx.createPanner();
            sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
            sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
            sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
            sound._panner.distanceModel = sound._pannerAttr.distanceModel;
            sound._panner.maxDistance = sound._pannerAttr.maxDistance;
            sound._panner.refDistance = sound._pannerAttr.refDistance;
            sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
            sound._panner.panningModel = sound._pannerAttr.panningModel;
            if (typeof sound._panner.positionX !== "undefined") {
              sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
              sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
              sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
            }
            if (typeof sound._panner.orientationX !== "undefined") {
              sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
              sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
              sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
            } else {
              sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
            }
          } else {
            sound._panner = Howler.ctx.createStereoPanner();
            sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
          }
          sound._panner.connect(sound._node);
          if (!sound._paused) {
            sound._parent.pause(sound._id, true).play(sound._id, true);
          }
        };
      })();
    }
  });

  // src/scripts/words.json
  var require_words = __commonJS({
    "src/scripts/words.json"(exports, module) {
      module.exports = {
        words: [
          "Open AI",
          "Prompt Engineering",
          "Data Leaking",
          "Hallucination"
        ],
        timing: 1500
      };
    }
  });

  // src/sounds/buzzer.mp3
  var require_buzzer = __commonJS({
    "src/sounds/buzzer.mp3"(exports, module) {
      module.exports = "data:application/octet-stream;base64,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8PMwWKQi464zgNQKQcQXyzdG2FDKAh5Clh8GovVKgpD/012WyYuJQaIhJ61sLCIoHBIkTEjp00DplwiFDYMqniBwNHlhw+9qZk0h+cVacUTOX3r///936NUJppmocAqDsKULWrR4lTRqI49pWciwuFglBLjLUxc407vpHMLY2BKlE8EybhEk8wJgeLrKKABM6MnEHsCMRBhSSt78LBcUXUSONSpWxWhVP61ff+pZildcjjKSSQeh8gPaE7BxtgnX8jMZCIG13YZmYbYqkJaLARDFhaoxJtlWbW06YYy252PRrRAPNreGHiw1L6h6ZehOOsSZQfZYfJdR5IxXr2f0p/6gAElAlACsBIRhKHESOUx2mo/+bk4ls4cBL1f1WqTNqWx/GZm1IMKApWdBoqAQVtBos8iJTpYOw6In4hDUryz8qGuIj0Gnz1Z3JfqBl28O/lj2oOhBVQlgKFYGwlCUHxyJjQlZFRxIlrycAkpko47LHpYOiVR0seBo8CrAVBWGuCr/+5IElIACpRXI4ekw0FPkiU09Ix4KZHcZJhhjwSwG46TBmIgKuHlj3LHuCqvrDpUseWGpGsNeVOh2V/wV/s/50RJMQU1FMy45OS4zqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqB0UAsCoeEYACxiSJE4sw8MmQZFQTMgEVFTJkKioqlCxXWKkTNjosKiqfiwqK6xVmtnX/6hYVZxVn/+LC4qAogAQFhCHhGCBYxaKJxZgOGgMEhIHjQwWbiwtuFm6m4siKigsh4r/WKizUfFRYW//oHios38V/ioqLNRi1TEFNRTMuOTkuM1VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSBH4P8esHK5EpMAA9QNWTJSYAAAABpAAAACAAADSAAAAEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQ==";
    }
  });

  // src/sounds/correctGuess.mp3
  var require_correctGuess = __commonJS({
    "src/sounds/correctGuess.mp3"(exports, module) {
      module.exports = "data:application/octet-stream;base64,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";
    }
  });

  // src/sounds/letterReveal.mp3
  var require_letterReveal = __commonJS({
    "src/sounds/letterReveal.mp3"(exports, module) {
      module.exports = "data:application/octet-stream;base64,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BEsCUnJIkoROOlpiYiCPq6ExYMT2i4+0rE6SqWTpDJp7FNTp45iHIdh5D0JjyOjZN6FatZxcSk5oThxWIScmxHROfUhMeFoqk1gyvRctZMSkgmPVOi8bO4dLxJcscu6trAfSISxUciCanUZy7tetYyjiJTEbq6F1l06WwH11sC77VTHxVUCEqrQxQidJ0hmpkXU7hKLQSj6fHNEyOszNmxJTqfAA8JPDeAdgbw9QKYOZp3izEhyqUqhe4hNqhap6K7B+pAyrwXSehrzLWr16wq1Wq1mvFbUNZWonSFML0no4Wx+y4Yor6HFTFJLjRYmVLGkMJoWpURFzwWOugiRIhUTJoeRNhUMoSFCKYLNx/6RMQzxv1KOa1rw6BcLCpqqHILRFUmxU31poU2Dgp///+bCeCmxTYQ3IKxBWQU0KOhVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//vSZAAP8BQAgANgAAgCgBAAbAABAAABpAAAACAAADSAAAAEOrxDmrNMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=";
    }
  });

  // src/sounds/puzzleSolved.mp3
  var require_puzzleSolved = __commonJS({
    "src/sounds/puzzleSolved.mp3"(exports, module) {
      module.exports = "data:audio/mpeg;base64,SUQzAgAAAAAQRVRUMgAAFAAwMDA1IFBVWlpMRS1SRVZFQUwAQ09NAAAQAGVuZ2lUdW5QR0FQADAAAFRFTgAADwBpVHVuZXMgMTEuMS4yAENPTQAAaABlbmdpVHVuTk9STQAgMDAwMDAxRjQgMDAwMDAyMDYgMDAwMDA5NjIgMDAwMDA5REYgMDAwMDAxQkMgMDAwMDAxQkMgMDAwMDI1OEYgMDAwMDI2QzAgMDAwMDAxQTEgMDAwMDAxQTEAQ09NAACCAGVuZ2lUdW5TTVBCACAwMDAwMDAwMCAwMDAwMDIxMCAwMDAwMDZBNiAwMDAwMDAwMDAwMDBEQ0NBIDAwMDAwMDAwIDAwMDA1RkVCIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwIDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OQQAAAAADeAAAAAAAAAbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OQQPAAAADeAAAAAAAAAbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//OQQP8AAADeAAAAAAAAAbwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA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bjIftalOXcccf/eX/zWX9//xpOzpM1MEGRF0EmsdJgGnhPh0wdSg/VZgNGuv+//////U7payXISybqrV/6F7f1O9SlvdHp2Zapw8dIsIgMKnd72/Xx6gALxK/vsxekzGIBmmi5/e2/6r7NZzeyFajECrfd////9WLII9foiXiJfuPCTSi3///////34zt///Vb/t7fu350Zbw26xAJAADsyT2VVppKN2IgV2I0NQAB1gfPYAwTH4MHiABqSozBioyrZkXMUywaD5djMhUzY0BQCi4uZIuFoCNIBpOfKpJJFVzayqN20nXUg29FVNBSD/85BgUhJ910CjUpJuFHt2feYUpLwQpwoDMT7aRBAREDOLZqmtw5Jx+K73/37f1///9VXOimlVHUv/6CzKt0f92tWm3Zkk03RrTPUbm61splVm6nCRVtXo5AAsGJp720M1kRagRmW7ldnP/69dtSfKG63dAGMylKU6//st//bcagXXbrmIQSd2x3rQKv///////7vmJXbX/9dlsr/qei2/t2Wp51Vbbx5IlAAW377+sOa1rvNZV5NWlbLHSAhueYNAowToZyiRZKApVakloLTNDZ2W5HHjxTLlyUEEy+5dLpwQEAg2Aalh67l5EwtdO+/oIupTbMrcvk2BAuGaTN61m4y4NUr/85BgXBFduUKjrdAAlKqmhedNaAAdmbqmghVZGEunX///////9pAT60mRR//WpBa3/sqhenTqvZ6ludEm43dQad/NUf6MAH9b9dTadkLu6xJwSJSSaVND//6XNWeggxEBlLiH/1f/6tOtAOgU5vV0Aqocab6zSo17////////kw/V/TL8oaHDFuNT0YC1AiHCcAB/RP6wJDCAKwnUctw4ZUMHAQodcoQgABlIgmEigEgoAjAJlBO4QRAxOLjK4r46RlQJKy4Yk4ty4TRFiLHV6BFC4RMKAzc0RI8PUIaYmJYEEUSotQlMZs3NC2OoN0BI5WkVjojsG4yLKWqocB83IQ3Jg2L/85JgbheKQVaiwtAAGxSCrqOCUADyI5RqoXMxy6Ip9YrrziBFzd0CYNE3k+m5sPkb60hO5FThPjuMmQoDFZEaNMpDhRv1GH99HrWj9/9F/+g03Ugmm7f/6jf//+o////////nMhUAQAQIU5BTOi2otaxeSGEYsHGigRxbPcNjjhOzGa2rd6FarFp1WNFMMYW3o0wF47sMgUmbM4yxd6jNnFdF5rnjyrXzLmGNsowPxJdGFdJ0SNBGycYH/X//1//6f////9Ub//+jf//////wjSAAgH56/HuW+/jvHX3MrVM7Rf43YGVP8tJGYwOoFPwfMQpgViqqWa0l6Dsox1njxitIyNg6//OQYDYQualQ8+1QABH7TqKHzVAAwdtSajImEl3LpMl0igZ6AoqGkTx081NPX21IoihRMjZ3VuJ4HckpdzGpl7pBgQknegukkZBqRaRUiipZkSLJi5nZr//t9VVP//X///9is6aAEMAKBSX/qdH6RkPFlrgn4hjtf//++4uFk03ezrrCsBez31//i4unziIt9OnOFoa+3OEWNTdsqyIK5Kd///96m//9P//+RHjIADAZXlnzlyAByu1B0mZ088dyJMENv3OKQSJi0Rarnrj0We7yx+v+63e7rS/m6mFLSodho/+9e+upv7N6Xyx+SU2ntQ/dvY4c7z2oKZRhWfERDxMkiusw//OQYFgRKalKow9QXhF7TpqGC1S8CUQSeesmqnSXlwPGRA+g+o1Qjniim6dWWDqmFIuybI///7LWnV/tZ7pN///MzZk/+iQACADAM//mZO7GQnaWYgNUWia7d//9vU4/ED2tS3WoGd9///DwbfsPxq/uluqgZo+mhGDN6dRx3FhLf///Mf//pT///QuAdSAApGbMzQzNrlICC4SIRA4tEvlFmEFyzENEIeFIy7TML+8YDx5+td1vmN7H9y6ryn5n7IisV3U7ecb9VMa27j8jgWPIlmNd7z+b5+6dqqAvRAyK1paAo4oqVbqJ2cSZaaBTBLG+kfapTJmIQJMqdJBTmxJWFeW7//OQYHgQ/adK8w9wXpJLTpaGE1S8X///XZJ6Vf/sv///Qc6aVVUgIAQBwzOe7L6lXqOjyT0QMgL6lUlaj9vt+2Mxr00+2YojHCW/b7NboHg7+eCPaysyGfBcHWtqzRoNn/NqN////6f/////+5dRECAAIB/71u7rnf1hrf/n2pOIdDCE2XxdNALGDtNgLzDIi5XFiIgaIEQR1a61Mo0MR4QJokFmxGCDAojIO6aQ3kWSNkkDhcF2Dpo5hcQQe7My6TLXqMjQSdN1KQnQvSXbqdMvKLBumtNBAEgQ0jRFSKVUoDAG2mnW86cdAgK1Pb///Unq1uymde9X///rPQAOYAEBEK/9//OSYJcR3adK+61QABNDTpbHUGgAeiv1HSQdBSgThlm6c70vbZVvv1CwW9lJal1MeDuVIav//Iif0JKFN/Tu1VaYmRopl/ibJNtqNs83////+v////1qRc6k1CAcxKtOYREVEzoAzmFqEmCUgzG+EWw3SUAeaBYmICCAAOriEwBqsKahrgUUgHABcBooFoopUUiZAi0Hi2gowIGI+L5JE8dDwmrmJYFlpk4aEuIQqZM3KIxoYmKxks+kPweFFJBNMgAsw0FkDMVlQxKpWC6kXKbkyxaWidANBCliZP1SHEs5cIcgmyWkXkyRpDpWaH07Y+yQqKCVzj6DfQZ1MnsxiQRSqY72QP/zkGCsGYZBVqDC0AEejIKyhYJQALxoRyJxNy4QFaB0pkKrOEy1N///9nos316v////////hdzVGBgAfdSPU4QGdOqWI3UK9wfC1PHSo8YsDhizApWaSnPbJ6q5RMwl5QUNrPH++YlV5586xyMPQWB+QtskCmQGNyNs/+pG7qWp+VLvRLv6+jeZpIS75QloepOzubGhtjid55xIy1qe///JjtkutUZFdrbf///////ArrQAG6lJLUy1WWipb/QD6XTFDAuQB6hZRekwmTooUHlAG6KVJ1BSZb2Ukgt9mrMRpJbNtdTm4viKo2RejefR626BbPAgGSp8+nKCSV/snrRHJddaLf/zkGBVEEGBWPPpTAAUMr6uh8poAFMpA1/ospG39r9Y1kOtvSrWRBLWg/TOs2bP/1BtxYqVaMaeeIyyEC8JqPMFqKCadABfP/Y7RjddkM4OmnekkGIzWyqX1/9Jf1/U0odX2X+pLMUQ5heRtSb/9ay4//X/qd2v/VrvKZr0P+ZfMsFXf++S0qeuYEoKiiSgdFbnrJGQABe6MDOj330SfLkNFo+7vvCF9LAnlyoovUla8B28y+B72WF2BM8P+M/39flhjhNwv/z1Z7j386rlYUMI3dJjBKktGQ1XRZDKBXLgQ4RJ0UlFZS30P+KYbXZ9dMdZ76KC2pVo/q+iOWWupX3sQp5tJP/zkGByENljUvMLUlwSOr6p5gnUuEykW9nW/FVD1WNY0KjoNFSCTRkfpAH8AG//ygcuxY1zXDIFer2CcNN7t2+tKf/rQa6J+3b6UBUpyWX//Quz/5D9dv//1Ek9t/6KI5pmzI9JT+99KkJNKPC5hcWPUVirQADzFCwBoIBJhX5pEMzwqWrLGXnZWNqz0ppWA0FqHAeMGfTEW5ZmHlwz7qAsfvZfZ/HVhT++fzLv/+9l00JQFlFY8ZEOa10iMdVIwdCxSNjoBMTQ+T1RitFFefpmykkmWMueW6l3soiJvt1OyST3/61oHQtybn1aKtGisvCDT7+yaSjxr///xKt1ssVrAHoAD//zkGCSEcF1TKMHM1wS0uqZ5hNUuP/3BKl+5LupJQIYxtUpRmBGqZSNaHuh+uc//nCU3Vvv/1ngCSdz/v+u2IGn9xk/9k1/9+oLgnG1s/VJ4TFZ+nIHf/f//f7agLUwAANSrlFhRzLoVvGmVtDJkt1NwAK5EFXancnQn5Ussh1oiRG/v6Bt/3+ME7/P9Vv599i/df+P/vnN3jVFK3rEOb/GPPX68m9bzLngCBNw1baM1xvW2c/Gaff3lxzbH+K/4XVs6//3v2ltn////11elBgO85rXOvj6xehCqf/P/1uSwAjAAV/+dgLoPxOesNgtK85THBoDR00JfMPt+Ub/fpmRb1pr9P/zkmCoEG13TPMPT1wSUsKV5gqauFXX9ZkDeZ0K0HqX97VqKv/T/+ybf/W6AkxcddD9VQm/qOut/1BtAAD/3tNM1rS5VD8fUbFChtC7kSq6tQ0pIerPLQZOdGXYZWDuIaRbafywhtWLv42myd7Wy5vm9SwiBYYa+3jhqvviY4A9sYaBdcfKLpp0xySucUnTcrm6zUdAHVQmBOFAm0iAGxoUjZ6LImqnZZwUkuyqCloKGPPIUVs1KvSU3qRdSKzpYC0Idi0UDlKmtJKYBbl1s91sbTRor///8qje5HAsAAHl/zAyzXMR2LsdERNUdallAIYRNS3Wo+rvpflJG231LU5avZLXoL7/85BgzBQlc0SjG1NcFLK+jeYMWri6XUdA1spJpku/b+5uyf7zV/1dL/6fWHc8ql23scC8GmGqAU/+z//UpQAAA8KrSaHxj2DBRWpSIxA1kHv2Jc6JgCaNETNafkO0j0siEVkk+xKV0+MdV5lat2n37VvZboL97C063cs8ea1+XNHFA1FhlZo6CSB5mSIY7LUitaazY2GuAQnNj5EzpfJM8gx571IKWmioc1FbWWtR03HAyKKdqFNZxSS2V3qMa0CiEIMu6kUZxa2U5wG8wZhILBECAuT///+n/dgAPz+VMyL6kAKTHVxqNUWmYEYHm6k3m/9H9P8wKfp+d7bu5sAQOzUlXr//85BgyBN5X0TzD3RcErrCjeYKlLj9SzLt6kVfX0Wyf78L0bmVbObRUAvaqOMgT/1Hf/9AvsQAH/5133dty78EO5ahiQXafKxhdsYLBhFqz+Xn3iD7pDgU5tOoUzh+JSUSRKidHSSzCI9qW9RjGvnhhjScp7f4Y557t6w3n2Yij4u5yvbmKSZctQBIiEw/bqUm7fM88Pz6hw1m1kt2MllS+Gb7m3Mqbhls5PsYgOwnxXbGW+0wQx13738pn4kkkPZyX2zua/Hmr///////fccvumbKN3wziFk7ZsTcfiuJe95WBGDs/AIjh+vevgGwANp/+TP8YB36SB0cY5y+mgsMJcbUyC//85Bg0Rb13VLzYwtumlPCneYrVNx7f26H/0yFZaai4iOAchcZadXd1WGUe0RH2prS+v/qehASH/ddT1PekwzkATB4yGMf/PGjf///PfXTIGPfnoYe7VPU9DEMU9WPc8ncwDi8TtkABxqGh1SYiY9azYzS2R4Y8tSxTsrnn5EEkFGG4wdErYiVupL+4T1NB+8d4362t8wrY5ZYT/2v3veX5fugzmWra/fMqOXkJBx6h9Eu7JUWRSgnZ5BSn7vvR+tvb5qtR8FWyt1r6xMRfRZCkpI6XpwMQnT7rv9iJ///+v/m5SWjqpOtqqK0bF5F0Fhx6ABx6/Kyuf7g3poJE8EGfW0eh6//85JgoBFZz1KjD01eE1umoeYrVNxv/+6m/T+arequpzAIVFT13+qJ6v////+mUEC/q2iAYO984noIoazU/tl//////MKnerI/9rsXyIDuAAYSEYYUmM2eQdZqKBEG9aikBpGtRmCrtCfCnrMUi4cAIksasxzOblW/187+Os9XcMeVG/u1944aivNb7NQqCHFytW5nc3B46eHkeRhN3RT3P1OG+ldMxQU7u/auvr9dk3UxeRcX4hIxo6+kmmZBBE8z6LyySySBAlLX60a64+0V7q////6zM2///YzO5LM06gAILatd2UEd2TzpcbmFIP4ECSSmAfjfUgp26l37tU36HqZZ5lru//OQYLgR7c9MowdQXpTrUpqGE1S8pMaARFOz99eGDmm/v7f//XgRNW/qwXQUj2VNSZVGLJ+7+S7/////5N/6qsyQABgQDSOjsFpoq1khAIP1sqK2IAkJmhhqJ2YvWzgodcNbz5EqPr2d1/LWv53eX93Xe7eH9/KRZf3zpCjcKxoipFZZJMIXAu8rJLatBaOgZmAbMggzNdVu6vZZxqqlVUDHLgfWuttF5oGQhbE0k1LXMCrWRpspVJv2UUP93+tn/VVQSqgAICj+tdDGN6nI2qZH0gxhLGPIZCR2Wr1/fqTv1L9ToGtT6nD4EZFNur9Y429v/+7fVbdSx6JI/rsEzKLb+aLY//OQYMUQRWFO8wdTXBNqvpqGE1q4we9f+5t/b/yf/6CKADIh8h7xHOqGoLOUQOLJJ334obQyIlnr2MCDMXBipZVfU0FikNFaIy9ok/AD+/b1qHcak/qvV73jR4PvSGxb+q5GFNzJ4YcYwrVej05OSd4XGC6InjuvGb1a9euWb+PN9j44bltLas3JVYxpOb5zWWX/3W7vO7/mdb8b8py0soWJyzuGt5XL1imqgk+kzPX85nDPCPPfnmwjCxz8f//5j39QCy70dfKCpj/2Q40S5gAKIbGpCzxVzh3ZEsmyATxGykkDMNFJxrsiebobfdR9P1pPbLZQLSLtWkSQXgIahp9/rEQf//OQYOUVrV9Cog+aXBjjUoqGDBq8rbV//s39BFTplQTk/StO3YzAZot0H0q5RZZLLrZv15Q//7f0deqmlWe/9dbqAAc9czSGjcOKMdqwUVQMLAFLKIblCm6XUnCgQTwCuNS+Ikiu5VLPSjKmavyrzca5/65rnfbDb3O/jzVXHDueMJeJRHO7fr1YJzVuHoKBkDExNUFprQrMEgIAfSRSpoa37t1y4rbUi6BFFmhDwy8keQY/OmqRsdAWkT+cZFJSlmY7kzEiZarSV1LUumRJ33///WqkpSSV6KP9anZ2UpaszzWGgGS/6mX2I72TH80UAtnKkUh0G1Jegzdf/n/2bpuZGtvP//OQYMQUPc9Gow9yXhRiwo1EC1q6gWDyWjr9boCZNZfrb/6Dfs7pLpBf0XoLrrTg4BlXU92MDdCRe//l///SgyV/R01gqAAHHbqhu9M4cpjWJdLSJpZJafeZJDMvg6oiTg+FgSG6JqY8AkQBQVaCXTcav6t4xnDdFrDeudbLLMr2WOXab952ZqWx9SVfL8a0dokjxZ6njpq7onTeqYmpwLZlQyWZmq3oJ69NPZx1LRX0jpmski6ZFwHqfM600zOzGwDiDnGKanMEEDekoc01qb1XqYbN///+tPN1pNhU401/M13MAwADpANnh3/zl6edL3lxFIDaLRFSlCfMk1r//60v36rK//OSYMATtZlEow9yXhPKvpKGG1q4N6t0z4QRDdle347V///6bftncrIlt6q7BRFBa3qdSj71P/+s5//QpwGb/y2kdgAHXsoR4uhqaZr5eSAiAmgn3XwMKDBoFh8CTQLSVmyPCVgIHEhSDrEMdrwdh3+TX6sYf+vxemTTFfHn7s/fz/UXfX895cswDBxIFhh90zSWmlSTadYph8pE03aedkFVpOz7Y/rZFTLSdSyNWsbgY3WXkVnll4yRSOAL4OxFFFJIqmBfLRkUyJpf+tZwr7///7O26ro0O9upBbmh2vmcNAMl/LTO9JZGRtGMWnALIEQgy0h6F9qmRq7t2+ft/d1LUbP60//zkGDEE9HDRKMPcl4V0sKJRAtaugogjpba+pqhmatVX1PV6nPatelQdNgsVuukpWzBUxaqUqqpFJ0U39/7l1X/2f/Fjq+olgAH1FCuy1qpMnd00kBNwI5z16B4wIypNl+ypSAbRcKejMMGJFSRMDWYIo8qLffzx5U3+Nv/+C4Rcv6//z5zeNWXXZzLHmX1ZMVAlLqzU/v/zWf91zawWGDNSdXbq61Dgf0VVolRPUZghSC02QTPrTSMxjhqNmWkitakaJAZ9v+r////Ut6tRw0W17rutalLVvevSNs2GxAA2v3c5SyrMCdVsQMvLCYgujWQFDEKupv+35mbqb13fdZ92r3EMP/zkGC+ErXdRqNPbW6WKoKF5gyauEel/V480Nv//mX26jZnUF/f6a2UYhApqdSds9kkPL+k9/9lKptygnHuWcdcYLNnZkCJEAAeWNG6I4V6zqIdwgSlsw+dEWXFhpfI7KBByzqip1kGKmRQXSypJJPMbzw/+97R6+93nWyuZ2j129/P5+rtmo2bveXcMJ0qgtN1TGDLtUpA8UxGbre611ft1oFdlprdXSnkEAuI66lsePOgsIcnUklIopOkbTx81RWr/2//1/7rpWQUykUDeZCBQBCGlCMMPNQoAD+2jI1HMZwX0iv0x8lRhegybWIzV2U3v/aYn3//TV1p1pDFT/9aEf//9f/zkGC/EiWnRvMHcF4Ua1KOhhQOvB3t9VnFRGRn9EQ8SQ2x7t60HW//X///+vabrLVQOKNZoNwgXPEAB1hQ0YpPnVxntmaHAMMJIOl8DSELIatitpJeGgg8NOzF2wgFxL3NrGoCtahd3mvs6xpuav61nAKUFW/r72pf+XMdTkcgXKv+rtSHSwHqcWDhmfSrNaSkjywmhstqkN3Wrs/WPFdXRszIoiEBPzc+xsaJm7uoyAdIP51Zqk61OimgSZsyZv/7f///SvSQdGeRRevB8IMe0uKP9b/+AAc2SIo8+X1km9aycKrkwFZNXROigR5SR6Pqqf8zNlPoavonrdbHRTeyPbrZQ//zkmDME4mjQqMPbV6WgoqF5gyauNvdD//nNSuuhagFLuuy12UCUNlp331us3Vd7v/vFRKGjgSetw9xK8VQqsDtDAAB/hKsyq5rFZY+utYFj2WU8PTaTJMIsNKkoHe8ipIYbuYcWlB7b3BFvOXZdzxyuZwjmefbP9Voq5Z459lH5Y8ubj1nPeHe4SEqAY8CXr3oroorWoiaKOpJCtXagvz76bo1rUX1OQ8EaZAxZmdNFApBBist1mbs83UgTqBgxklS6tRX///+hdbPWzJLN9dDpxFyXuXdmbrLn6zw4A+H/lItOxTQfQGomkJUCtU60g3Biqo9fav/ll6a3rf6DntXj6KTqv3/85BgxhOJqUSrD3FelcKOhUQMWrqq2l1m/v+3t+ptF0SoRtF+pSGsYIbDagz1qTeTFKMgL4h/+pmp7JN+g9qqXopAgIAAH5DGzkeEozEB1MyUCTR5VgawMHSXcuCrkD2eGoTVbEYwxF5ZVZklfk5jv/5r8cssvw+o0HdFjzupb+P5qG0YMkgkmcOFUMggyBqgbqU6j+pboFkl/OtsrpN8uPrru7lVJIaoWmJmqWkTSSR01DLQqCTPugtTGQ1jiVa/XtLh//0HBpppcWFwu9ryYLsAI5BMAOa4Il3iAYAB+hTNyXpn6JGa8tNoHwBRPoIsE2FupbIJ//8zb9ratBfdjw+jyb//85BgwhL5X0LzB3NcFlNOhoYLWr39Sn9H9tvv/5x50Lkh/esIMopVKde9bnl/79Jf///p/SQWqxtgt+8XOxiHxOjac0gABtCE1FFPTmH8FpFCW+diL0ACIgg6fgwEkJ7eLu5FlKDMVQaWpNyPU2NXDHLKtvfdf/9qzUI7Jse8+XZfngXySHwX3VoFAlw7gLqYJJWoJWZNzJErJ3SbU3+61FN7LUyO5SSSHQFwpbXetmMzAoghkdtMyWs0c1PmqZfdBNaaa6kK8n//lThU0MAQFFUkBom2Dhr2Cav0+EAeZ5fyj+cNVaxfnkQgBGplQOgnnEUmayuv/nW/9SnUeX6BqNZYv9//85BgwRMFX0CjB3JcFLKCgUQMGrrrMn///z3+/mIeE/1NUJaN9HUpFSdZiTD4P6J3/7rFG7hEbUmQSu6UF9KkQAbLTnEkVMtDrtQM0AzsAfRKWymJkq+oZKkPw/il7lTyqJh9WCQBlsedCesQr7H4ynXO93rHHk1B1yd/8+UXc8sq/IkuPGrl9eajySg8Eyant75+Vje/1U7KaPZm1bvf22sskn661uinWMYB6RSW1F3UopgFiG+aoqRMj7JpsiVmLLLpqi1fZZc///+9JdJNSlNdNW27KTZ+paKS1LWcSGoULvr2GgAGsmb8ZWJ30iurTJEkTEJ4snFsZh6ooqNTdWr/rZP/85BgxhSp2z6jR21uFvLCfeYMWrhvV91Gu9lqF0bUlff7GFX//8//661D6k/6kTIIAlnSTQdda01KfUkl19Rt//ngmloFHSBYqyYAA40CS0MAB/pLzlCAie5V1biwIcOPLbhEDmDDIcQs4EJmcqFQ/ahhfZlBGLJMq5AVq7lay/mG92cN56y+tO1N65rVPr+9RKI1hxO7JJukAqgKpqZH2QzyKDHDVAYhkm9Ftb6ttVZj+z5itx8C4OtOq70TIBqBxM3zqCKknX/3y//9IHEKDQUFyoNggWEij4w8hkGGsgnanS1AAbTz5nBNfTKy7xLDVwaoN7e5gE8Y2nr66v+trev1uYH/85JgtRJRX0CjF21cFapWeeYMWrhN6uiLo2qf6Da2m1Wru///6taGoklWQ35kFEPBZPAUi35X/6T0c1Awoseltx5RNsSufY8BgGIABvEIAYhEcJExiBVyeAIM2s5M2Aw0pPVogztD2za3I+voAeGMwqcdLW5D+f6y3+fezGOX4SCtb53HGk3+vMCIi7IIsxSUamzDnB8J9E+iqY3W6Z5hBcn1H2v233r7fooLkw6hFBLTM+6SZ1SkWOAnhoG62Wukgzf/65p/+RNQycA5EeVCZwrKvcdjHDjm46XLJ3/qAH8GUwxSazes06A9i2H4GdJlxMhuR2v/79Hb3+0perJo2fqbrqNf//OQYLwSWWE+owdRXBMiVoHmC1q4////vqZ1B49mVVREnIN3/y3/1Lkz6zbDkNj4iY0PPh5nbVoAKAe9aqq1VO60UD7pKNwNQI3EsKVkBj1xWZXIK9RgFXeKG2GGjZDWaN34Kr4Tvf7a/D8v7n38pJZuSffM+Vd5flc7HWofl3DeriVaJUaluXOczt//3fycif9bqRVsp/6lGaX62k0jKQL4qO7TJJZukYhiMTE/W6alKRt/1Kaixvb7Oipq0kers9Oi1tFmddBF2RSZWmqzVrQWYoNlt0wHGGWfhbbQALSZyylVAw6i0qpYddJApBUklKMwTc4YvPf/trWym9lV6JmfWrpz//OQYMwUVds+UzdRbpbSUnXmDJq4Mc7oUO1XSHdaqp9X/2f/UZssiC671Ut6wNJuwzNOKHK/O//XF6mqizEEnrW5CTD19tRnQAbxCMdYVYleMgv7SWx5FI8ZDKQLNTCuCDCdYNS9jTMwL1L3NNpoKnrlv/1nru73LXe6+tzdH38O2v1hosIGIttBNTFkigQ5C1umXiwhUbdFcdybKqVspV9voan7WLKKhrhkRI8kkuiyLGYFBkXpVL3P5sOd85/8Li6BBBIHw4hLEh4ggABYwBkE2VGHJbVhdQANqflxEX6ka7jKkswtYMuo6KBG8pTtb6//V3b9jqX1uMQU3QvUt+rK7P////OQYL4SBUE+ow9TXBXqUnnmDFq4+r++jmYU3ZnWpTOHII7CN0uff89/9Y6FpByyYqJFuETVCd48TB16zYysWAAG33DqxsV5CKj6kiH6t2U9BzWzGDcaNWdEqudsBV6kUYeZcPkSS41PBlzGRZfhyvjqv+dfn8mr12/r7OVnHD9FKWR5prYvkVGyEUIUNGaj555w0qVcpihSTWfqMDffrUz1Z9nqdabWRSOkAAkBJ9aTuiipa0hCgqTVbPXURU+h+7/5sJF3AEsw3FnCzTRCDpwaLoWPmUV7/sgHchJ26Myce9yntCgXAjwIozVgRx2ybf9H+1/V9l/ZNxHBHUltv+XHr/////OSYMYTDUU8ow90XBWqgnnmC1q4W/t1HKjolFte7VBiNP/mH2L//A4PCrgGoEgvMuM0Bw7Qce5AEXF2PBgAXKQqQS0EXZkEVJMfLwm0EVx1ZXAKqBhQ7AIEobGDg6JlQvjLtN0ApwLwsWpWwSy3DlfLWMmyztUvMtayj0Jq4a1fyt9/9ySxBcHbpM7GoZc0QCcWC0u+tbz3nRfzV3d5ZFNpmpnmujrVX5M/pu6iOUmOoCZnjZSSKD0EUgT4mFzButBai8T2j/0DX///9ecqQc1Wk/ZbVVMyLVunU+bHdD0L+m4u+X/gD2FQcibRn8zK2ggMsQqgjRGyT0CDEKjW1/f/ra//sf/zkGDIFOnZOANTkm6WUlJ1RAxautP1MqtxUBmT1/7qKT+tX92+g/76aDEwLi/9SmHmOiEUSwF+t3/ygYe8MpVZFhdhtEOMeOGqehjZMCgBvmtPTHLRzSoesklA4RnpQ/7YDFS4iIn5GDIPoYOh6q8AyVFBHezgzPU7+tdyu43tY75v6D92f3z8MPy5QV3rbNrLVfLkOlUDgCyhQ0WtRY4Na7pLZJHv/zjq/pmbKGOCTINVZCkksW4vOq91em7f/U////9K7rruy5kicza+u6HI2lJqdzifuSc7e2sAB3MqHm1UQ/nTTZYp59QTycTdotZWatv//t/+x0/2Xl4Uv1fzX///v//zkGC3EY2tPFMPbV6TOk555gwauNfr0hFt7a6xVO3cv+j/8jWBECiQG4uYSgsHTZtJ5guMFIBACAVxhzCyNQnISFrRCBAwByqPRaSgEmlplFwohh8AxWntwaYbE4OET2yqIf2f5er388tXcMce4/L5Hqc/WPc9c7rCHGjqEW93L9nKiKgRIgBLTqzd1GKdTzZIihbZqCTX6S2f2L66dlspmPKTKgLaW0Fu6VB3LISkxUmqg6Ppp9a9laVBF/+3/1GGqyzguJEBz4cY3I3GZvMGKRR4n3r//rb64AK8om1S7t1J+GNZMgJaYJ8VBs6JCVVp2/7f9vr65ZP/WgWRitr/7GX////zkGDNFBWfOFMHkl6VO7515ixO3fX+ujsPhZPVUzhaH+f+//9Tv///nI3Sdd7G/W/+rok1I/RPD986s6+wgAVy0mstRxbJrbSQuYCdwX88+TzQOYUcjxDFxyeCdlnVuKN3MOXSsUh2xHL1q1ewx7U/uX6z1ltsbZ9Xv33mXLv/WyjqBL8uayv0o4CjwxRXe83/9139ZZVrX0lJpv+r1sUVa12skfZYuAraz550HRUhcLSK7UVNZaSqJ9JaP7Pnb/T9//U6SKKC1K1p1Mt0V9luySzFdaRmeKpaLJSV712rdkoAE0FELLUZe6Bi1GJ4J1IIPBZF1JByBOm617v/qXzifrUv6P/zkGDHFEHVOFNPbW6W2oZt5gyauJNSrbZh9Fsynf/r///9SX/RQwlXRUpVl5kEAbd7q85YW8r/+SoY8xU+ks1rChUeA2BkOmcUw6BWAB7agkDEUSCRbZ/fpEpVDrFNA8QMAKhIBiY5NHDANS7IZEYIaCw7JKWVSbtFhn+Pf/DuVr+ael89Z9/mOP75/cI80HG7reNNexJgHBqaFTrr0C4p6mZ36qreyX6l3JBSh3gkSClpK050yAVBSWqvuylnEn/02zjehvZe3Whe6kmSWp0lJqQd1IbKUy2QmuULkvGFjP9S1jOfa8AK4M6q630lVfUkW3oqHUS8IKC8RdcR0PaVbf/+cP/zkmC5Ey3HOqMPbV6VMlJx5hRUuP2/+VJK2SYJaKd/+jen//X/zsgAvvXarGBfCh/pX6FB/yfonaF2HnFEoQyOYdqDy7xSG0o0gBgAFtSUiZosmp6qbOpaJwPZBXRzVC4yGAYJGAUBwyoD1EBioEhtw8D5FcBIoAKBctlUmkTAtIUmutF6PH2N9j6neVkq0pbF4RdBqDpE0HsBmTQ3UhzyPqKynUtlN2/9fspWednLoEQ5qtFSDugmoEmFompaWqkzr/9fOq13tX6/u90lNQTRcyepjM5sgk6mTWa0TimeYpPMg68W1FUpW5J7AApYVM2wBnN/WbbRnzZYbkHqi9h1kSNVW///85BguxPt1TijSq1ulXpSbeYMmrj84f//XIPUpTFZA9qt353/+v//9HMxhmQVdTdEKM8wzU1/ys4lzTV/btJtgFQ2LrGdziKhxpK1ta1CgAFf879afP3i2Zf81ttiA8laN8ZkAkqBY0QECOwAJ+RYc0nxzApKAKhDRIkcNFFdJBnekmk5staQ3SsmfflyloqMhRndaRkmVg3RFWWkmhnq2TZMorrUyP/9f/Wk5meUMQTVb1Ogo2TUsB/JVJ0WV62U//fmFant9v9utCy1rd3Wi6WutBk3dS2Uq6VnuZJqcxcyt82EoprW6AB3FFZNmozIn1obuNJYsugKNFA6BvICFey//6j/85BgtRLh5TgDPo1ulLJSceYTVLj/6vuhtfUhDl7afoY3/////sHHt/cLkbyN3+KvkqpDqsQw8fPjHxcLND5g1cK0MW9TzqkNpBAFdslyT453MdL7u2tFgBeFPag0UL38gELohr4K2SGaBfZDGg4MeWeqYVZFYw7v8d5d5zX6g2ju5d/Dmetb/7NWLZ73lldo2fKv1Z1rLW8//HPvsysYM6P0Kdavr9fRoJKPgYzJU3rMXQNwdJDd1shf//qqcrXVV1e3/dN0XdzFaLX1INt0WqQddN0zNQcJuCnX2fQt/b9+wJvDiCQyQwGAc/PeXDVYmgQncOYMlTV//+p7+36P+44Gf/7/85BguxLB1zhTL21ulKrCdeYLTriDdv////6WMFfbpwMJf//+nIpSuKre5GcJKFiAEStKHE1FxCiERVpqXYfVFayYIAd91s5qukp2omrIqROF8FyJ+gM6FjgWkkPASCAGMufMTBwMaCAAYqi5kSkXWNLrZBU8tT1sN0lzHpopXUtAkSmS7vrWbDjBQJpoovXSd60HFZNVJOp1f0mvaZV9aklTJUiiUO1T1pOsvAUgvrTU6KT//2pMlJiT3Utuk3p78yWk1SNJSLqQWm7pqVRXoMnpXRdJkUnTP2Bw1sCYiGa2gOEAA95eIb4UvqX1D88FAHCz1AYRvXb//7//1P+mTDWv/ur/85JgwhPd4zZTSq1uk2MmdoYLTr1H///n/+fxKb/oFiz3t///od/7//VTiqLCW/OZ1t+zc7itQaWv38vnf7tgAgAd2NVzBtunrj1teu76bA2zclu4YtjpoGAbXDCTkP4lx0jtrwMPeAwLdaK0FJ9Fv/xu5/b5z8s8mi02dj/1ul3hvdSvHan43O/M0rGxoWt2+c1+sN93vmnc77PMbe3spcutWuroGaKx/CprQvpOyi4AUwwDIu6SSv/+iitRizrd0ldBNlK/z6LIpvTQZlpMb1onqCNTfVWzmbmqxjdMwXX1/l9UbQAK2J+iIp2qn0Bt0CbNoRiDuybCkx3I1///n1//af7a//OQYMYUjds0oz9tbpZbpmnmLA7dxrEvX/+Ze///Vv/V6EVfol7ALFrokr//9O3q67TU/80zPPY1F1Seju7NOR/dTTi8VgdmOY7pa/RNQB2zJCgmg6ExoJs6KlJjOgvCdMS4oLSgLBIuAhOYAUuGTLg4yWAKEYDAuHNQYnXTWgy0VJqUyW5Kjws93eylKMyPG8eUpJzpoH9DNpoI7Ty0mvHup9v7/uca31TF4g4lySKa1KOIrMi6E3E5dToMj//prUpKf+1bpX6Kqr1OpVPSUpJk00U3ZBmdSb00NBbNMV23omte+9qktQAS6TSW6SOJJ9b9YzoMBuB/U9w0ml///1v//U79//OQYLgTFdc2o0atbpO6UnKGE1S4xGHf/8r/////YzUKf99VCaes6j+0/AB2dM9Z7HtIiNShdKnrIEk58oZUKjlseKagAgAm+sRiO0g9Ir5qSFcC1kuLIgQ8GghOESANQ4ElMNI1ULWBQngiAhadA85/3ooKoulLI3kEV9B+mVllVkqMxPB/RPyGhra7qXG133X//1/0klHHcdoIBNGzrskxiDdTfZf9f91ouzH3WhrQQXZXToKs7IqRrT01uiiitc6qs0UYPVWUZBhP5BsIl3gz3fgLe2oAMCX3EZHAjmX5rrNDzB+Ai/EwKKTLW9X/9b//utv3Mh1//zn/////xoDfVU4C//OQYMASAb84ow6tXpW7wnImC0rdA3///oqmnV0YtCLOpLVVU5bpfqREoplWnmXVsqHa0RqVfZPSdPssAcuCBUDCFfI1osWty0lMofQ2mKxsWDSIFbgMd5kIM0+STsBGaKBiAG807dlu7nN6x5nlnl/1P1YeXWHN/jl+GvzsVL34bwwwipVB5zbLSXn+pkA4k1u623ZWzfUjr0rUzZBMYgV503Z0KKtIcAiuy9TNdmWyDvWp6KNGzLN9dBJJdNFVBDW9SR5nS9mj2YTeBVlh8SoIAQT9ey5T/UVFhQCBLmIWt0sc5Ub7DeRzuOoKmmtaAhES/qf//X//f/sQv9v0f////9dg//OSYMkTsZkyAw9tXpWTpm6mFJTd1f/oFYz///nzDbu/1Z0eurLYzWz93s6TjKKpqmnpo2bJGHaZfJ2JyD9+7AkAHLTVPJpJJ1pK1rUtAUkC7kkdGycCIUGZH4BZkgZaBxZKRDxSAGKx0CwSLiZmVESom+pKknWZsowIgYPqtaqicrUkgpROh3RRDxx+x92uyAuRbV2r/W37eutU6tRfAlxoqtVk9QNBlZNr0loOv/0XQdNGggtB3rr1rXWgtSTspSaloIUFJJLpJpXora/XWgbObm1NHWLMbtzsc9AClrFxzvJ3v/wbz59EY8KqTRrDHyeZa///rbb/7fWxmN//66zb////+v/zkGDGE1XZNKNKrW6VY65l5hzK3XGAHen7BoZRvsn/6KZGRtn9abPWXOjyHZ0V0R06JWZ5eVJijtwZS9hWE4AgByzBNzJlKdalIqcwoImAjMHtRSx+Zcmk3zXjAr0D0irc8aowjoRQm1VpMMNc1dx7yxzPuX6oJNq/l/8u/v/1ev563qr3uCjpWBcud1jrL+6/fKjc+8STVdG99marQvZ711XHaB4KNd0euOYbF0q9b1rNlv/SZqTvdJdBNJd377PpsyKznZlukmhSWozRfUp3VWpJSTPQPuiazoQ7d2pAbpBsZThmbBlmVVlll4bsFaU1Mc0kV7//+trf/mfxiJy66/xxP//zkGDFE6HjMlNLbW6VSk5l5gyUuP/92/6Z4NTMlW6KDIwj4qd0lxhdFbJ5FiCJ2KExrVFa3AKx6Sj0irTrIYtKzYCBQCX1mKC1VXQdOtFb0AP4KovnCdOhAA0BygMAEcHVwbxJoEPCAKheROpmJaQegylIV0dSZwlnPrstKvSK6ysp71IkaKKyrKrZd1s4+no9//9/+pWTBGXfqrqWH81/03s/93a6SLKZal06VakE6tSlUKnUtB0Ekd1pUVpLdR/SemnUqgYKQMU2QZVSDstZcGzkIWacAO6CMi3uueJ+gvazQI8EEvUNBrav//1t+/0Vf2K3//zb////39aghb/jUu3/p//zkGDCEj33NqM2rW4VM+pp5hNO3P6amXMz+equ/9Ocbaatj73ZmmIdmV77KprR8mXZDlR5Y1Bw7JgBS60idSZSSlJ0jxqk8vA0IDcPE0VS+DckQaMYFpoFzAJ8IkSJEgMPCQLgRykZaSLalIUzObWapZQJYvn/PKSVnzEelpsixkZDpEwOJ7stdlM5ZIPq2Voq9W1jppr1q6KDgRTOk2tSluICN7Vvvf69DpJdTqUtSmt09JbLrZ0K1IoIIMpNmTQQSQZa0kU1JL3VpJIrZTMapGnInBqXkBpVCeAIClVfacyscr/OGutpYOmAT8Tk+gKcSb1q//9bN/+pP9kUrfb3Yxb////zkGDLE/nlMANGrW6XI8piBiyO3fnf/jgnv984DC+n3t/0r3rR3Tquln/sjOrTmRFOMdEMR5dLNROzGq6PHzrsI3zTzXkAMAcq3QPIMitampqZaZwzUQ0H1JAyJ8iglgmgtwABYAPJIYwK5fFcAxKPgcFjNyiarPpKsyS2dk0FLJQeTFC73ZbNcjySWpJkUpMEaglVs9JnczNE12d0ae39S1IM9S+ghUPoWhJt26SQTAhbpP6qbv+koxTQnT6NT9NaDP1su7oVJMx89ZKmitSF0tSa0GTQUtSbUzNQTqIBNSX/t8JdaAFLAXInKcciE/+DbRUYOkEdE+JutMOjMm6X//Whfv/zkmC+E7nVMFNOrW6WQ8Jh5hyO3d+leqvrNf7fpfX///9fUC3/dAiLOn/v/29b///ZZ9WQ1q7ohp5mx013uljlozGrNHTCe333QoTdGGAW2FIkD5TAVX/cdjzbXvu6k4EANNTM3g5OanzMCyj8hdDSB6jwiBrZlS2onektbDe/rfjvv4Zd1BFndFnh3PXP1pZoNJQtZbHB7pJqTo3LamuakkzLVR6S9upG6f1+m8mA2X17oOtIEsUHvdF0nz2tb/awDAdNQHc35/cqhUP1nILf/zuEKIPfFmSIs989A+N2XTcjADlGOcjqff1mmjXSCBB4ylONg17r//62//z/9b/1+h//////85BguBJlQS5SM21dk+uaZeYMCr3/qBLf6hMc//p/pcu+zXZnqyMT/vK7rVb0XPZZDHo1ByRhjHiQn6y/Of6UALllGHApl4W2IdxAKhvxTSHhX2wuKcbovZpYzGDOAhnIVJIeMKDJPl1qWC52Znf3zu/y7/O1v3Es6053DWt/vfbliq0HWeH/q5TybSj5qu9rsfcmmjJI6ban3bWyRokztWvRQRTLwNa0q1Oy14csWr0lOtSamdJ7baSa9tatNqaF1PpIa1LpLTQZk2RatBjWzprUpk1upSSlHTQsIVJXCS7B+pPvpByABKIHs01l9Sideyl1BfkGaNXZQgMf7t/9a9bJoe3/85BgxRSxzywDI41elvpSWeYM1LnqxVP1PL09eqMpr/07f+n7zkoIm/9FDF5P49rvJv4I15NXqsj+W/+rOM53fx72ml4hfjr3sGkMC7J76JeAGAcrFk6xgkpSdI66lJJoVCEYE0ZoCxFQbQn4V0BLQAwyByeN0h0AYHAAmZfQJVlnrJ0GZNSVrqQMF1IomS/WWCIsnZNTC7Igkk707dWaNqZ+/b/ZHq9NczHZR39SweU1fezuqq19TKSoXayKCKlrUqnUzrTSSu6SaTU1KcyRQRSSUgpeg6PvUg6KnN3MqunmRON0ABATjinfdf/VUb9R1jImQqhCtY1VI6VTf/svb/sqjv7/85BgsxI13zBTRq1ulPJSXgYUyrg0Hf6N+ntT//XX+uYGT/wIPczp/r0TKHNamUUFjgeMjQ2AQMlrg4pxZrwm1dIuFwo4WWAFtwJnzFnbZFzeJt7fVINmIDqF5ylaFKhUFd5W0wHoPNH36oqBkJgpKwy3Rx3uV37v97Vx/P991WqSa5nr8tWOd5+vgifyz/mtYNHSwx3/N97zL+ay+Y5lrupfnpa1kfz0pKopUMXU3q9SYLwOmPu96a+bsioc5HW5Oe7KhpzucyuxMY7scp7mGTZ/Vj6mGTbI37OcpH2J1MNYskUtv6dR1ABAUsK9ygymT/3H9mSEsB+oJ3KJ717bf9ev/6j/85JgvRPt7ywCP2pvlHvGYgYUjtz38plb9f9f///Rv/5D/0A7///5mrd632/c70c36GTzTFONeqbnk5+dVDGa6qYVUIxgAJr6wAHKtzcuk2YtWiymdCmpcmQqAuJk8UyGjwLhAwCagCumKMapFMAIWg2OkkamKSCaTIvUyC7bHCpK3Z61VJkcSToupJJMZ0VFBBa10H1IvM71fdS/7qpW3rXQWw/h6ZBramWoOyloPrvqZ13vrpOqij1M1NTVKUnWhZa3QT1IsgkmmyTmKmei63ZBzrLOMjMI16kvVGs+9979Q2UBATooBtaER3ZlJ9TbzKkEoCtQdag9grvU/Ur/67M//2/Y//OQYLwTBdMwA06tbpYTxl4GLErdon//9b/////X0A9/fSLjvf8n/Z0+y0l6el9EVJpWV5KVm1Jdmt17ipDDVqLF5iwAcNWTd4AIQDlUaXNTBFkElUnvXTAhAGialkpKAgAiuSgAIKAY9wmZOEDF4AKZARBMnkTNJaCCmorSZaD84arSrXR9jYpGz7KUgbioNTRupKu9Zdr6L1P7ZtzraLb4kggO0yuySYc6+c6U/mmEb3PWc5hR1Yx3MSs93d3U81kIjGVWpPul0Lup7M6rY1SZqHMxW5eZiksLz4lJgDcXLhAjXqAwxH6JU3pGxiE6CAKnohcORZb91/X/s7+r0dG/iW65//OQYLsSTeEwVzaqbpZKTlXkHNS42v8z/fVP+f/9lBUbt14e6VPj0qWlFF6bBth63hcAgI848LKeLtJ5cVPDJtzVHAIqgACpNkTYmE1k2pbpOWTJR6yQJkBP5HGZZZLdJBs0MAlUDlJb8htP6YrOZaJ+bUzTdosd/h+sO75r+7ms6tje9cwz1rDXY9ru985lnVXDj3W/1vn//61KrPvNPt93NRE3V7VqY6zyAASe5zudZlgbJTlPtqnZ1Y5N6IlXe5ipdz3R0fV1ZTOjT6sh6NOc9J6KeqWOnM57Gqm5hinFmV342ydx1AICUZDQwMzFHJ/US1TymaLCOCl2WozDAJI96v7f//OQYL8UAe0sA0uKbpX6VloGDI642pX1em37Ceevr/P///3t9m6TQx+3PGpf0634fFwMkCmnro2KpOoCToEYL0nDiokLDxKdNjyQzJ4sAb01ZaZo9NaGmevoEPAuxueJAmwIhEcRFABT+BqsADjLRQIGBiIFgiCqTGMyXpu6qWzXMk5ptMPU5KUN7LSFRRW761srrKf9bLfUrR2Z+7JaqmSFNlVvoLWsdpTZFX/1ob2RcyRTWktCtJa3TRdVn0K3TZqmWlWqy0r6F06nS3rUk7JptdBByhMi6ZqQnlhL2S+gIDmj9sJqmCNL/8fetGB+BfU1Qfluu62//7f/7fzqH/+3///v//OQYLcSEeswA0qtbpSz1mYGG0Td/+gX/bBP///rVWpvnpUy3SyuqbJoSZ7UOzWeism0rMjsI6WcHDqJHUN8ewVABvwpKsMaSm/bUGSv8GVuCjEMLJwSQQuBgQFgSBIiQEYGBokOB+5FFiXAYFLQm1IxIuZpF9a60U3QZ7oTh9I8m1zrLo1DUJP0HKQ5QwXmdNSJXapSUmE3LPzkPXQ96WQ9GdTN6MziBAklnS6UQ4JA2zXcx6apXR3c1D90WZWY6qazO1UMpuzo55+dNzH7mOdV+7nzj2JzyIOKzcUZr8wdZtQABIAAA7YAHcgiqqk8/+f8oLihgrr0SuW/ZVbJ6aW67qrb//OSYMMT3dsqAj6qbpZrXmZeHAq9/6m/nW/r+b/////8G/+JNp//9UdudlOrO9PK/ruqHbMYc5bmGEkkGTMcE3jsF0udWP5mf+mAAoAUqzpgkUk0jjqNEEC4eTZ7lEKoimLafAgFBcom4CDDAxAEhaSgUzQRcGAExNjropKqdCtFbVMtR84itqTqQQaojh6qd6kjQnU+9TWepjd9tN3bOWraXrpNqsgAtd6sy7GBREj3fzMx/509EQss+3P1e7Hq6Ncsazu5VEVWKNkyGseZty55p6KYYhh5zSswsXffHpb5XpqMAAUmPbPeE5xD/1v5s7E8FfTQx82/+j7rnLt+rSjf4j+/6//zkGC7EsnpLqNKqm6UGlJd9hyEuP/////UA/+HG+r7TCx7dXNtacFXiYGHh4+0sNWDxA+HDyhwjSbEQDPOxOlYCtjIYGlIyStRyJqjrnV4FvblxpsSCAJKNhQI2TuAByZXjBJgpCp1Atq7lje7c//3+eWt/rdJP4a3/NXb/63r5iD+56ww3clVbqnrUiyk1uyix1WsglVdKpTIvqN3s6SF3U6jIJdVFVT6lkmUVUnrXap1Mg1JdJbLOJI0K0mqWqtJmWmqmyK3azIoILQPSUdvzmd9UjPGMMsgv4idC8/UkjgoCAnSCZFdir83ziF2WWVIihweSXLJ5W9v//RV/9X91t//qf/zkGDEE/mlKgIbbV6VA95eBhSK3X/////fQO/r4W+/+X/zNZr9Po/d09t2ug47sVCFXuW/mzIQVqd3RjO5GKMF+WlmZAMAr1d7XjtiznUyw3zmeW7WGDPhaZJIDtJ8ExGQAZYAhLgHgQUUhTUiYGGBOCIOpLW6S1pptZmQutSywW3Kx69aXrWVkVb0CcN69JTo1VpqJ5nvTpTulZhj+121UYh40449t2UHT3PRKLpVdX7FZMY7mZIiOf2WXMMTdD0mGu6nHSRphzsjnnMis7sx5Kcc5imlSlnNPseb/W5YADAKlDc8m0ZiqfUa7JsamQTMFSTQqEIE32TZF//qU1tf+l/o1P/zkGDAEyHZKqJiqm6WOiJWJhyOmE6d+tXXX//RNP/DRnqDP9GeC66RRhhjGxQrYBFtKopYOPgV7jAiGjlA0VAzVjgwJkgwB/quwgnJPshGVuTqahXwRA5ZwmS+DYCCwJIEBggVhUiiGFInRygFyYQ0e0U3POhVa6J5loutI+s+hsUHWk7sdNEKTUEykzspKmm6vRNbWWy2upr7rQVQPWddlPQrUFi7pLVdJGo0I+nr3VZ726FFCgqpq3d+k901vfZ0EWUpS0EUDjM7OlUjROsmk4eh6WIdaSpURUnt/IN6QAJgADlin+kZwxIn81JvaVLgfw4l6iGbd6r2TQ920GWv/3v/t//zkmC+EuG/KgIarV6V40piVhtEvf/p///6f/qE/+C///7Mio7Nazzn+6tTWrlZELqQRgCdlbNens2m4Bjou2ZSRU0X/6AG1zSaggU1U1Ge3U8v1ep+l0KsSjccEAecVk5gYoHMAOox2rLACAxoBUn0OWN/WX3KuXc8Oay7yYkeeH/Zw3+H/9m7e3hjzfM6TD63Qx7/mN4/fVy+9j+mVfX174dxMcQ7lIDffbai6qAo73c91Fd/ze/ZxbZ5i2urbUTD9sdum381tmGumXHrY7acdGcTsikQjiHEiTkkGvZP4fRJztQQE5zcCG8kJWcuz6O9nSShBi4GSyAv3/Z/6lNf///XV///85BgwBOVsygCJ4telPPWWgYcBN3T///9v/4D/92/X//U627MpqfdHRLPukjHno5WZm6sQmZJ6nVnIacrUQg7Ws+1Gq+gBveM3WiePdWu47qZ2rPMLFd+Bts5k876A0CSalYEqD3gtnErsXETE4scruvw5vn1t71W7hzepJR6sfvm8McrXO3rl78vwz3jTxTuufhrf4Y/zmqLHK5rV1m5utYmu6vm+Fq4rxDBVCcJLxfiwmmueZeEvq0n5t4JV25qmZIiJ045tFmuqtB7S/MtEM9xV9s1+9DkdZpubVoWLKzE8+dufhE6AAcAAN1Aa11YpP+qbSukB9AnGaslz3TrRWymZ/f/85BgvxQN6ygCY2hulWumXjYTSt1rMtX//+v//q/r////4b/6jf/3/2kJfMhrsWX2zG7odJEV3JZLTrM1/bLaNJkjAfRYQFwRy9/rBfDE8uyx7wt1np5dU9p4YUQ5S0mLcwEQmJSFCgk0gMzAsZQjykOsDAJJBsQdmKZcajQTUaKqUs0UNwydJnd1MyVZs5aRTe6SyGmtWymZSCD0CXXYwzoyaOtqucYqO7u5jojFQ1dUWuYpoZ1Y87QxM1mavcwxUdabqxyHmIVZjn/Z7K7Khx6F1qrepQxlvbUsYhQ2eYekoAgLO5NTaFAAwXcYIKojsjoZf9vZomoIBuUEft//2///////85BguRNh6SgCPqpuE/vWZsYTRN31//////VP/ldrft+/Wl9PZNns+6+zM99DqhlIh3VUfOtCVIc5XZxZEKZbCyd2SKL1YgG4hLGAelOi00MfMxefdKzIeGdrFZ0NgwApmPCMyQxuG2NZ1IaMZDwHA2BqWvfqUeHMamH5dx7nTZ7gqd1X5nlllj3vlWglYdxQ2ywpLU3jRMprjEsKErA6WloWBp9WNHRfDk98jO3Z7soG7U8tDfNA6IyS0Lpd1I1HdAtOsmIS6hOn/SkOoKlQBeTmU4OG1ZOPgSfELiw1RJBY2nzBxempYggJR7ydMeo+shT4r6ihUXQrLPUJuP3t92/9q/v/85BgvhP5QyQCJ4hclcPaVgYchN1+h/W/9vVV///1/+uVbaZcIb//0fy2v0dJWtSyO501cyq7qa7sY6oYj/ae9NhylZEmRUOIf5qi1WwQAqYbJNtM16xa09419Y3ihngvlmY0oNAMbEVASnANFgEei6ZEAAwyEBDnNUTZNKmtqkndlvpFRSbXSZ0VOm6BtRW7oIoDzSUi7rN69Sa2Uc6UMSmqnd5h89rfSYOW76McFC+rrzGSiv6scrIqNW1Gqj2z20SeY81WY5TNlaebOV1cicejrVpa5SiOg8ZT1ES4b0QnLqEgAE5rI8s4f9YIv51busXgPKC8bqW6+v/+qt3r0v/61f//85JgtxJl6SpTPqdulPuuWhYcRN31////vv9N39P0b///y3I9i0Vu9Xz2Tq7My0OWzuehiXU97rLleC7+QJxtGfG8bdQCAF8N7k+UsPC7iQr7g4gQN0tGFPCCTNM704lchc4oBPwSD2bS21SGDgKlnS5bv/Zxxq5Z6/Ln4YY415yrn3ffz5vHHdiplreeeeGdaDuZ/jh+qPW+9z3jv7UZpc81vVR/+aszokcHWIQLZ60eG1w6qs6Kt7itnnrSY+J6VYeNO7VYWZ6pmrV4206q6+pe7vqVW0+Yu/ItXMsyIgmJu1p0ux7kbp3DWgfgRZXpK0zu99R7vJ7LA2ARKGue///10W/+//OQYMEUmf8moj+IbpSDulXkE0Tdr+idR///r/t//+6rEf/D31+3/yI3vRkL36/7qyq2qmY6tdFeqIDVpHUl3RDmBpwmQheTvsfoEBuvYle7l/Obr5Zbu48xy5X7OEzTQzJojwahEdBIgYBBQLesUc0LxmBhMPh8hinSQZB2UtN60UUlLWy0KabLTfSQUmif60ZItZSTHEEXVUtlKlFtPrXd6jN8czFdzt7bNRSQTb7tvVemdudse/+G3E7b6z2/iX3r091S2K231P7Nq31fLmSi3lqEK31bv3bUnXNLMtVpylwheyxPJbdIl3AYgAAlLckYiJAlR//192asCwMClrLp7oPV//OQYLoT1eMoUmKrbpTjuloeG0Tc7Vejvd9+6u39f93///32/7/5i//X9//+hbbb99z0bJrf3ZVXbcxndlbdmqUj1ZDmCsD1ZAC7lsSAHhojFIWYjiM7tTi0tDc9p/M91KYpLy6CSKwAFKpycCSOMTex40BgFhqlzv5581nvm+9zwx3l9Jurexyvbzt9ww1+7VjuN6tjlQSbto8FqOa5WHPHoiczFTcsnGX7ssTxdLd3BAqA6Kv+OmkQXeXhDGdovaL4TXgvfie4+65pPqtnfWhmnVrVPV9yN7zUcbVIPWYDZpUbmt9jv/8Lt/AALkAA7uAFmwmMorVevTBgn6C5+rbmrQ68//OQYLcTccMkASeIXpWTum5eCoTdw1UMq////////////9//o9L0/9E5m9jVtQt7US5XOrIFRKtS61dkVwRinek5kZUUzhyOGghPqpblOlQQF8sN4h60q1T+HrceFH+tVYgS9Y7DICIYEHjkAYDSoGrQIMeVCmK4BhsdBlU0yymhos6KE41NWkfUeUpk7mbaJdQUgmYoJSgVHoIOpada0aTUGid6u27iO1mK4mdJmonqEAiPuOqfq7o6seOR3e7ia7hnm6lrVmLl9em0m2rvuOa+ed+235eYhE+pqIbbbThE3hpZR8EtHBGjftot+oAsACsxqEmerCDMT3LXsZusGIEHWyxJ//OSYLUTgesmUj6obpLIllY0CNpM0jto0VSUGgP/v6OQ/1/6OAPqeB/+AlNUfc+xq4pWtRlfHkXHEPC4YYsWEMKrBwTPgMwACkJptjho8RGEE0Fo0kmVeUzC06qeib2wAQ1oTcBn5NtFnZmKvQQjqineV79mizq0eeHOf+uYZ3MNUk79y9Zq9w1hy5borWfaHK/cmJ2wlIjWeQ68TKVjlqVKq1e6tSOJedZp4eX6KQCdXb0vN1iElubK1Vw+rRPY6JfiXmJlXxsTH9UfrNyyxU+PUxo7pYp1NkDRgBIBCR4HwFmpU4l3X/GnGwwAI9AJhjOs1rXpX8+soosJcFWrWSKL1K26+v/zkGC+FBmXIgEnaF6WA9JSFBxE3d62oVr3/9fektrev//////byCX/00Vtpn1JpkN3Sm6f/0/fTTvui7s+ZWPrKrHKpToRCFFMuYpBVwtoAaRtkqmKyx5sQ7Wgs1sR97PcNw3jRK4CAKH1IsElqBhgDEFQRNxZQtik0TZFK6DuerdG6mUhY6kug5nQpIGqJ9eimRh5BJN8yRdkHUtd7sctrXqpiIU/R2PJfdQCHLor2c5iJVrrZ2d1JR3yHVHsxERHWu85Dm1RWoiGOd0VTzkZGOsjJZ8tTsc0pUYYh6qUsUvbjzwYB4AAnQQ63d9zL9ebzmkCL5s3Wq2ltXUv////t//////zkGC1Em3jJgI+pW6S29ZeNhNE3f///3/+v///uydG1da1q0yP9buit2/RVo/ueR6sJvVwBxjGDlT0C6v7UBgG7c3R1PA22xcQYj7bZutLXUg8aI0SkBAGCzSaAQjQCngJ9J5NwbCh0qR5ZulSQOJpJs61si1BSBbUiYqsig61nDWzrOqSVRQd2qRQd0nVUqIitB0wNtJiPhHeq5f5jpMEX5nbiJmeHvSefiYie55T64jb5tXqaruvi+X4pZa+h/fxVxCzLT93PEVec8Ur7JdqZDYO18jDrYBQEcWU/c1EBTb4V6TsMcBedFNQ7D9gbFy2QaNPnCHSSUpKHMuT/oXXZzDlyP/zkGDGEt3rJlI+qG6USJJSLBBaTFE0pbXmiFCl32UOix8vUl/nS2nceBd3qFQiTCLwoGzTjpcLJDQl4inVyGvWzbGYvZ83wFgb4xyQxgBAJQp1jAiXA4MX7DVK9QqUhoB031q17mNqk1nzmGOHfwu/zcisZz3amPb2uY1K9Si3W3V+gp90GdS5lljzDmt/+8FzpKV5SJGi57qOsfcXF3JzdwgwOADyLpjHqESix9KKq9S0GzQz9dU6i2mLOZbWfhairlVnu5dIQZM09XEzdbolI6xdrHfEXRtsbLZfFjwLTa5REkIQBYAAyCkuYsUgx1iHW79tpPWgDGBFJ8c6XSdaV11JOv/zkGDOFXXtIAEziG4WeiJO1BtEmJa2dGxn69urUXujfr/7Sp/W68t//0E92RURetCUdtFbFfsgNQFFhj3KW44dSJp2OGuYNmAJQcFwCBfbJiy6vDta8fO4lKf7vKK1IwRTCILNC8AYEQdcRiOeYAUMiTGtAyQVdaLUmUupFA4y1rddqV2SPGyk6amRSWk7T9kmZ1rVUmaSZleXJ6ZfBK+37KySgSubItO+E768oOcQ+I1LSv1uy5nHzXOZER7rvTruzFZopyuhyWWc6folNDNFNz5eHyC0AtJxySAHgAKcDBToCwZE7L/fosoIMZXj1brXZ3qdFqN29//9v0P//r/9P//rsf/zkmC4EY37JlI+o24VqzpWNhNEvdPvZqEbS+/+1dkZyX3V9kq6Xv6sUs466ka7QAk06KjDxXsCaOQ6Cjqd+toSED5ytJxrJSQphth1FRmqbAtBadnreQkAK9gcwAqP2C2zV6kyECmNPzlPcxz1/O8r573ld5lQZ2LFWzn9mvS58qY1cr8/lj9anqX8KG7M2s7Wf3cN6yt/tSLKIWrMVYx8iyH0xapjFLm8nGYMW9wJYW2OYSU6lwUiccTZCxDGpFfGz0ySsLEfoyWsq/cRD1VJdzDxqm+/atUXdz7xSjygALFcDtM3pTHowABIABSgCiEw1ylOdkev77TmGEoLrl5u7Ogu7q7/85BgxhTt2SBQM2huFePGVlYrRN2rKv///7fvv///9P7/+qe27vVvdEf7c/pTZPdDV56kolUdPlrpZ0vqi677B0BBTKVwyYw5MzGq9joMB6huAVtG05tXKUSxwbW7BKeFepI6gjDHXiYgZgWS0kfxzMFD1+dqfbvd7jUsflz/yzzz7TZ4TmWOsbvO8qoINn948wcEa+ynTGtXS3fPuXuoW8Qg/0rXnEK8y7OqsN9Rba8MxebtJMybP1uXcbFJvnNcr5Wb7tbRm+fr58y4+axn/NMPnYFL8x7PoqMRN4rGRx1RGyQBukKybAKALR1yMhBt1MVK4/mbwgwyeareo+LtCfTFvp//85BgtxMRjSIBM2ZclDCWTiwYmkxtJexdvR0uj+u9FL01ydpPa+tLFMiNqDokBlCRxBb2uaLWqDCSqwyWkwgWErUKSkcxZoAFsnInTCEbNWLntm64Qx4BlSyTMQyGNIhoJXgCspQM0EgMMKIapkj7oVJOitFTtsjTME0k2elSdKdZjxxN1KUtSCjNJS2QUmhunbPdoCndDOvcGU8iOyENuKt/KkcR1OqVpg4f3c1ZHPVqsgKqXxGyEiyPO98zCxSX3uVrwjZiiHVlJ4teVoJcQ1scp2ztstJ6AEAwMHBhCKxpmZSmt7ei0QoMjcdyX0rsjt+/b3t19/77P6rt6pf/+T+lvz//85BgvRHd3yYCLoNulNvCTiQrRN33/6929lujKvc00u//qr1qe90ve0l18yNS2m71VHFU+hLSOP++wApwV65Cq4PZw6vskyVy9ypLZI296Xz19KmHHZCsoYeHvFSyKUCR0n1jUy1nSZ6tfnU7hcta3Vt0mOV+5S2v1lfufhY1Y5V1lhMUla3y5qaG2OOoYLJVl6VNRpLjRhRkoc2qofUNEKdKUoUfpSJRS4kYPYVEhOlmEUTa0j0XwpJKddx3aLfTZ8Td3U3fS8LDW818RUWcTZ2ZRtsHIhojmfK7HJTk7RRegBAuEzvtSrKUwmcvsrqU4+ggVVOPqVd199///q6//Q7V/1//85JgyhSlsyABM2helXvCTiQrRN2//vRP69/tf7bLS7Okn30b2ZPOyXRq1kNSukqPtZt63R1XqlOnMtGW4uBcqPMEneXWEAepUOGwf5tlm5zAx6vNezcCI4kO5EXhVLoD4AU/kmgfLoGAByoiik51ktaaJxJqKt3N2n6lrRsdPozJaZ5KShPomSS81QZ6yipN08KelVVKKBkcMirdLnelZQdIzrZNVapQfn6cI9jPymILmXnYZ26+UKnW6R/zBalPtXirVrG70q32nHVQcgzuFWFmmeH1qRUJAYAEki02RCHJnyJq6qx8B9R1Eg50ZUrLTP1oTWEgFSq+9qpVrhwbGK5mVROk//OQYMASGgMkUjKDbhYwkkXkGFpMGhc2MQaOxKYrqasKCgwSZORklmYnQZTeQbB1KgKNOiNRu0oB5I26sQEQDIbID7Go20S8G2rndxTgXQKRPoCbh3lUEKQGWTZlIhpwqCboVnzBkUXNWSzy2MmL6ZqpJ1pps6mdRvTRUgqXi+mnoIoG5qarNHZFaTCihcJw6Mao9nYvDiPev0ds/W2uwtScyI6ZcepZLbnWOARLBcJOsZVShbLSNRJyXdSyaHkfT7e69zLiQlTYOTYYjek/J9RLFSBAMEBbSx2fJETdTnbXBgOOUfoMmEnrLWXQHq9Cxetw6y3o4trLO1qvdki+1LpfFxdY//OQYMYSPeUiASaDb5PAfkokKJRIyhOrElg+dCTAGGFS9SThZMukceQKEW3hR5ceDDRC6bygZLtj+sZbdPNWupWXUM2u2pjOA6acJQojDpf+6AWHGC00znWm6C5zOlyl/27+PN2Ltzs3YuW+V6fe7lipypKqshxy1vPCezt4VcLNa9az1Wr2t2qpcoDHMGU/vG3E3L2H2chTRGI3a4frjCnmMXBj2GvX57sdeCr5rxjHPM5+9s9bMN992jWQc3K2WOP5V9WS0rtL7mOz33i4fqw6Yx3qMKPqixrzEkaGZr+EAGCYrnSrGdEq99TdNQRErLYYF191X8xnaan3bf6q++jp0Mt7//OQYNUV0eceAT9mbpZL0klsKoTdPon5dfa3X/Ju7b0a6K6Ec3T7bNps2veqqncpf8qbczNkkU7Iml000nKrIRaWGx9ZbjS4EgolKDbTC7PrVXGoRnv11HEbKTMWUITgXUta1Bb8SSmZN2sqxi5gbdkEFWakkkkzVpppqNbIJIU1fGPWf96x2+Uvoflz6ZRfbZwnTEwmvP8qR9OO2Z55ND+xzWUla2Laxtpduh6602iGZEdOo1gZVkQ00KV6b/wm7PV/dX1aCVskAt+oL7uyNnpdUcExIhRtfY1F1FrrTmpc87wX2fnA+p//Dc69xiZdQdxLZ+qaxA3Ez8WtaLneZ7v4EHxK//OQQL0PwbEmpiZjXqHrWl/+S8a9eas+FQmiiQRG0O1mr5rHOEfF0yPyzNnNoZMFL3JO7FaeZypnL+WeZ0cqRE6H76ofr3v5l6NM7bTHJw5Q7DtiqIzEDR/2lonfMBtDk2QRPuaEql1FlCwbpSkh/upZVxwuDtY0tXt8oRhe5Zrbt7nZm7d7q7vKz9zDm936mHcsvx12t3W+YZ0+OG9ZVe3s+1LWO893Nf272i2uJYANSc1UlKGm0uZ9MlzUKOZGZGMa42OilGh9EPxBccY8EhMYmFUThX+xiDN2etOdg47XNumWU/N7e3irQgoROiEkMejboUmlwLgFvF0nkNDgs4rMRmZl//OSYKcSudUgUCcjbhPAflY0GMpI98YG0mOKOrhcA0DVXU//Rq/0uqzU6s06r2M+GSrookZMChtFTLgqRFFlmjTQPARhh5xZt4bHgAwyRaYFxqgBlxNEUAdOzrslqKUYKQRtHVk0DRRcLJBwa7DZBoIKMxlB2GBoyDMgmjPKYwZmuidagkgmzoOkpakVuky9EzsxvUpRytBSTJJ8zdqCUrnufWJdpJ9WHOw0E1IhHmbvSyyaXFHfKwznMybzOuZw+MW2ee4nk3SbUrwnh1Vqx6WrservqZ0GYQwWNsbPvst2JApABcgkIM5ShHVNDz+N/KB56vHm9Oy2q05ed/Rl9v8/v/0/rf/zkGCzEYnrJAImY26Uc85ONBnE3P//0f/vp/6/upL17P6111bWn1J7ErzPebdFe2yP6MtZZWUrCRbi4aNcTh0mAKACEoqB0XEUBoDgHA6EobEnURSQjA+B9DT/O0zpyodf4LPPnQF1FVIlYsYs7xlL+v6/r+v6/0aprXeZbq1qam7jru8d8+tTdyy7qm7+WWW8dymzWv48ypqWlpaXn5U2WqSr+cBlORIkTSMz22SJEjL1ryaRRNI3BJJ+1acSAQCS9UcbMscS2f8bZ/9fzneZIktmZ/aseWrf6bZ/NIzNb+8tZHf/Xrf2OS//mqrf9NI6K+F0KCoRBA6WSsIyo5EklCUJR//zkEDFFtnpDgAfBm6ug8ocAGZM3MuenVry4yMnacprS7mHNdrgRc4nwM6iqmCumWVLWUy/r+v6/rsv9D0al2WVNllqmpu/l3eOWVNTWvrZfl2ryt3HGl3Z1TWvypo1S41eZZU1rLVVskZOAREiRIkSISjNVskSMzNa5pFHmkdKJJVRIltHJORIoz/VEgEltV2rfs5Wef/VkbIkUfpqPbf3n7NPP8zjftssk+TM95zzRxK5nPO//uaiISwNHi0q7kQEseMYX/w8i4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8i7wAAAAAAAAAAAAAAAP/zkEBEALgG3gA8IACAmA28ADgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/zkkD/AEwG3gAcAAAAKAW8AAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=";
    }
  });

  // src/scripts/constants/displayConstants.ts
  var TILE_DIMENSION = 100;

  // src/scripts/gameObjects/states/tileState.ts
  var TileState = /* @__PURE__ */ ((TileState2) => {
    TileState2[TileState2["GUESSED"] = 1] = "GUESSED";
    TileState2[TileState2["GUESSABLE"] = 2] = "GUESSABLE";
    TileState2[TileState2["BORDER"] = 3] = "BORDER";
    TileState2[TileState2["ANIMATING"] = 4] = "ANIMATING";
    TileState2[TileState2["BLANK"] = 5] = "BLANK";
    return TileState2;
  })(TileState || {});
  var tileState_default = TileState;

  // src/scripts/gameObjects/tile.ts
  var Tile = class {
    constructor(id, height, width, row, column, letter, state) {
      __publicField(this, "id");
      __publicField(this, "height");
      __publicField(this, "width");
      __publicField(this, "row");
      __publicField(this, "column");
      __publicField(this, "letter");
      __publicField(this, "state");
      __publicField(this, "html");
      this.id = id;
      this.height = height;
      this.width = width;
      this.row = row;
      this.column = column;
      this.letter = letter;
      this.state = state;
      this.html = document.createElement("div");
      this.html.dataset.tile = id === null ? "blank" : id.toString();
      this.html.textContent = this.letter;
    }
    changeState(updateState) {
      this.state = updateState;
      this.updateStyle();
    }
    updateStyle() {
      let style = "tile";
      switch (this.state) {
        case tileState_default.GUESSED:
          style += " revealed";
          break;
        case tileState_default.GUESSABLE:
          style += " back";
          break;
        case tileState_default.BORDER:
          style += " edge";
          break;
        case tileState_default.BLANK:
          style += " blank";
          break;
        default:
          console.log("unknown tile state");
      }
      this.html.className = style;
    }
  };

  // src/scripts/gameObjects/states/guessState.ts
  var GuessState = /* @__PURE__ */ ((GuessState2) => {
    GuessState2[GuessState2["FRESH"] = 1] = "FRESH";
    GuessState2[GuessState2["GUESSED"] = 2] = "GUESSED";
    GuessState2[GuessState2["UNUSED"] = 3] = "UNUSED";
    return GuessState2;
  })(GuessState || {});
  var guessState_default = GuessState;

  // src/scripts/gameObjects/guess.ts
  var Guess = class {
    constructor(id, letter, state) {
      __publicField(this, "id");
      __publicField(this, "letter");
      __publicField(this, "state");
      __publicField(this, "html");
      this.id = id;
      this.letter = letter;
      this.state = state;
      this.html = document.createElement("div");
      this.html.dataset.guess = id === null ? "blank" : id.toString();
      this.html.textContent = this.letter;
    }
    changeState(updateState) {
      this.state = updateState;
      this.updateStyle();
    }
    updateStyle() {
      let style = "guess";
      switch (this.state) {
        case guessState_default.FRESH:
          style += " fresh";
          break;
        case guessState_default.GUESSED:
          style += " guessed";
          break;
        case guessState_default.UNUSED:
          style += " fresh";
          break;
        default:
          console.log("unknown tile state");
      }
      this.html.className = style;
    }
  };

  // src/scripts/gameObjects/states/gameState.ts
  var GameState = /* @__PURE__ */ ((GameState2) => {
    GameState2[GameState2["FRESH"] = 1] = "FRESH";
    GameState2[GameState2["IN_PLAY"] = 2] = "IN_PLAY";
    GameState2[GameState2["LOST"] = 3] = "LOST";
    GameState2[GameState2["WON"] = 4] = "WON";
    return GameState2;
  })(GameState || {});
  var gameState_default = GameState;

  // src/scripts/gameObjects/game.ts
  var import_howler = __toESM(require_howler(), 1);
  var gameConfig = require_words();
  var loseSoundmp3 = require_buzzer();
  var correctSoundmp3 = require_correctGuess();
  var revealSoundmp3 = require_letterReveal();
  var flag = false;
  var Game = class {
    constructor(state, tiles, guesses, paddedGuesses, allowedTries) {
      __publicField(this, "state");
      __publicField(this, "tiles");
      __publicField(this, "guesses");
      __publicField(this, "paddedGuesses");
      __publicField(this, "allowedTries");
      __publicField(this, "currentGuesses");
      __publicField(this, "autoGuessCounter");
      __publicField(this, "interval");
      __publicField(this, "loseSound");
      __publicField(this, "guessCorrect");
      __publicField(this, "revealedSound");
      this.state = state;
      this.tiles = tiles;
      this.guesses = guesses;
      this.paddedGuesses = paddedGuesses;
      this.allowedTries = allowedTries;
      this.currentGuesses = 0;
      this.autoGuessCounter = 0;
      this.interval = {};
      this.loseSound = new import_howler.Howl({
        src: [loseSoundmp3],
        format: ["mp3"]
      });
      this.guessCorrect = new import_howler.Howl({
        src: [correctSoundmp3],
        format: ["mp3"]
      });
      this.revealedSound = new import_howler.Howl({
        src: [revealSoundmp3],
        format: ["mp3"]
      });
    }
    updateGameState() {
      let allDone = true;
      for (let t = 0; t < this.tiles.length; t++) {
        for (let l = 0; l < this.tiles[t].length; l++) {
          if (this.tiles[t][l].state === tileState_default.GUESSABLE) {
            allDone = false;
            break;
          }
        }
      }
      if (allDone) {
        this.state = gameState_default.WON;
        if (flag === false) {
          console.log("Didn't guess before time ran out");
          this.stopAutoGuesser();
          this.loseSound.play();
        } else {
        }
      } else {
        if (this.currentGuesses >= this.allowedTries) {
          console.log("Sorry you lose.");
          this.state = gameState_default.LOST;
          this.stopAutoGuesser();
        }
      }
    }
    makeGuess(guessId) {
      if (this.state === gameState_default.FRESH) {
        this.state = gameState_default.IN_PLAY;
      }
      if (this.state === gameState_default.IN_PLAY) {
        if (this.guesses[guessId].state !== guessState_default.UNUSED) {
          this.guesses[guessId].changeState(guessState_default.GUESSED);
        }
        for (let t = 0; t < this.tiles.length; t++) {
          for (let l = 0; l < this.tiles[t].length; l++) {
            if (this.tiles[t][l].letter === this.guesses[guessId].letter) {
              this.tiles[t][l].changeState(tileState_default.GUESSED);
              this.revealedSound.play();
            }
          }
        }
        this.currentGuesses++;
        this.updateGameState();
      }
    }
    autoGuess(t) {
      var _a;
      (_a = document.getElementById("fast")) == null ? void 0 : _a.addEventListener("click", function() {
        for (let i = 0; i < t.guesses.length; i++) {
          flag = true;
          t.guesses[i].changeState(guessState_default.GUESSED);
          t.makeGuess(i);
        }
      });
      if (t.autoGuessCounter < t.guesses.length) {
        t.makeGuess(t.autoGuessCounter);
        t.autoGuessCounter++;
      } else {
        t.stopAutoGuesser();
      }
    }
    //close autoGuess
    autoGuesser() {
      this.interval = setInterval(this.autoGuess, gameConfig.timing, this);
    }
    stopAutoGuesser() {
      clearInterval(this.interval);
    }
  };

  // src/scripts/wof.ts
  var import_howler2 = __toESM(require_howler(), 1);
  var roundSnd = require_puzzleSolved();
  var guessCorrect = require_correctGuess();
  var json = require_words();
  var game;
  var initializeAllGuesses = () => {
    const guesses = [];
    const alphabetList = alphabet();
    for (let a = 0; a < alphabetList.length; a++) {
      let aGuess = new Guess(a, alphabetList[a], guessState_default.FRESH);
      guesses.push(aGuess);
    }
    return guesses;
  };
  var findUnique = (str) => {
    let uniq = "";
    for (let i = 0; i < str.length; i++) {
      if (uniq.includes(str[i]) === false && str[i] !== " ") {
        uniq += str[i];
      }
    }
    return uniq;
  };
  var shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  var initializeLetterFromPhraseGuesses = (phrase2) => {
    phrase2 = phrase2.toUpperCase();
    const unique = findUnique(phrase2);
    let guesses = [];
    let paddedGuesses = [];
    for (let u = 0; u < unique.length; u++) {
      let aGuess = new Guess(u, unique[u], guessState_default.FRESH);
      guesses.push(aGuess);
    }
    guesses = shuffle(guesses);
    paddedGuesses = padGuesses(guesses);
    return [guesses, paddedGuesses];
  };
  var padGuesses = (guesses) => {
    const padded = [];
    const alphabetList = alphabet();
    const alpha = document.getElementById("alpha");
    const wrap = document.createElement("div");
    wrap.setAttribute("id", "alphawrap");
    const firstRow = document.createElement("div");
    firstRow.classList.add("alphabet-row");
    const secondRow = document.createElement("div");
    secondRow.classList.add("alphabet-row");
    alpha.className = "alphabet-container hidden";
    let find;
    for (let a = 0; a < alphabetList.length; a++) {
      find = guesses.find((f) => f.letter === alphabetList[a]);
      if (!find) {
        find = new Guess(null, alphabetList[a], guessState_default.UNUSED);
      }
      find.updateStyle();
      padded.push(find);
      if (a < 13) {
        firstRow.appendChild(find.html);
      } else {
        secondRow.appendChild(find.html);
      }
      wrap.appendChild(firstRow);
      wrap.appendChild(secondRow);
    }
    alpha == null ? void 0 : alpha.appendChild(wrap);
    return padded;
  };
  var alignMe = (totalColumns, columnsToCenter) => {
    let pad = totalColumns / 2 - columnsToCenter / 2;
    let tailPad = pad;
    if (pad % 2 !== 0) {
      let remainder = pad - Math.floor(totalColumns / 2 - columnsToCenter / 2);
      pad = Math.floor(totalColumns / 2 - columnsToCenter / 2);
      remainder += tailPad - Math.floor(totalColumns / 2 - columnsToCenter / 2);
      tailPad = Math.floor(totalColumns / 2 - columnsToCenter / 2) + remainder;
    }
    return [pad, columnsToCenter, tailPad];
  };
  var generateBorders = (padCount) => {
    let padded = "";
    let index = padCount;
    while (index > 0) {
      padded += "~";
      index--;
    }
    return padded;
  };
  var padWords = (words, padCount) => {
    let paddedWords = [];
    const borderRow = generateBorders(padCount);
    for (let i = 0; i < words.length; i++) {
      if (i === 0) {
        paddedWords.push(borderRow);
      }
      let padPlan = alignMe(padCount, words[i].length);
      paddedWords.push(generateBorders(padPlan[0]) + words[i] + generateBorders(padPlan[2]));
      if (i == words.length - 1) {
        paddedWords.push(borderRow);
      }
    }
    return paddedWords;
  };
  var makeTiles = (words) => {
    let id = 0;
    const tiles = [];
    const boardElement = document.getElementById("board");
    const boardWrap = document.createElement("div");
    boardWrap.setAttribute("id", "boardWrap");
    for (let w = 0; w < words.length; w++) {
      let aDiv = document.createElement("div");
      aDiv.className = "tile-row";
      tiles[w] = [];
      for (let l = 0; l < words[w].length; l++) {
        let aTile;
        if (words[w][l] !== "~") {
          aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l + 1, w + 1, words[w][l], tileState_default.GUESSABLE);
        } else {
          aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l + 1, w + 1, " ", tileState_default.BORDER);
        }
        aTile.updateStyle();
        tiles[w].push(aTile);
        aDiv.appendChild(aTile.html);
        id++;
      }
      boardWrap.appendChild(aDiv);
    }
    boardElement == null ? void 0 : boardElement.appendChild(boardWrap);
    return tiles;
  };
  var alphabet = () => {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x));
  };
  var buildGame = (phrase2, onlyPhraseLetters, allowedTries) => {
    let words = phrase2.toUpperCase().split(" ");
    let longest_word_length = 0;
    let longest_word = "";
    words.reduce((accumulator, currentValue) => {
      if (currentValue.length > longest_word_length) {
        longest_word_length = currentValue.length;
        longest_word = currentValue;
      }
    }, longest_word);
    words = padWords(words, longest_word_length + 2);
    let tiles = makeTiles(words);
    let guesses;
    let paddedGuesses;
    if (onlyPhraseLetters) {
      [guesses, paddedGuesses] = initializeLetterFromPhraseGuesses(phrase2);
      return new Game(gameState_default.FRESH, tiles, guesses, paddedGuesses, allowedTries);
    } else {
      guesses = initializeAllGuesses();
      return new Game(gameState_default.FRESH, tiles, guesses, [], allowedTries);
    }
  };
  var introScreen = () => {
    const intro = document.createElement("div");
    intro.className = "introScreen ";
    document.body.appendChild(intro);
    const startContainer = document.createElement("div");
    startContainer.className = "start-container";
    intro.appendChild(startContainer);
    const newInp = document.createElement("button");
    newInp.type = "button";
    newInp.className = "btn-start";
    newInp.textContent = "START";
    startContainer.appendChild(newInp);
    startContainer.addEventListener("click", () => {
      intro.classList.add("hidden");
      const mainContainer = document.getElementsByClassName("container hidden")[0];
      mainContainer.classList.remove("hidden");
    });
  };
  var resetRound = () => {
    const getNext = document.querySelector("#next");
    getNext == null ? void 0 : getNext.addEventListener("click", () => {
      var _a, _b;
      if (round < phrase.length - 1) {
        const getBoardWrap = document.getElementById("boardWrap");
        const getAlpha = document.getElementById("alphawrap");
        while (getBoardWrap == null ? void 0 : getBoardWrap.hasChildNodes()) {
          getBoardWrap.removeChild(getBoardWrap.firstChild);
        }
        while (getAlpha == null ? void 0 : getAlpha.hasChildNodes()) {
          getAlpha.removeChild(getAlpha.firstChild);
        }
        while (getAlpha == null ? void 0 : getAlpha.hasChildNodes()) {
          getAlpha.removeChild(getAlpha.firstChild);
        }
        (_a = document.getElementById("boardWrap")) == null ? void 0 : _a.remove();
        (_b = document.getElementById("alphawrap")) == null ? void 0 : _b.remove();
        round++;
        game = buildGame(phrase[round], true, 200);
        const alpha = document.getElementsByClassName("alphabet-container hidden")[0];
        alpha.classList.remove("hidden");
      } else {
        const cont = document.getElementsByClassName("container")[0];
        cont.classList.add("hidden");
        showEnd();
      }
    });
  };
  var endScreen = () => {
    const outro = document.createElement("div");
    outro.className = "outroScreen hidden";
    document.body.appendChild(outro);
    const outroContainer = document.createElement("div");
    outroContainer.className = "outro-container";
    outro.appendChild(outroContainer);
  };
  function showEnd() {
    const getEnd = document.getElementsByClassName("outroScreen hidden")[0];
    var myDiv = document.getElementsByClassName("outro-container")[0];
    var h1 = document.createElement("h1");
    h1.textContent = "Thank you for playing";
    getEnd.appendChild(myDiv);
    myDiv.appendChild(h1);
    getEnd.classList.remove("hidden");
  }
  var startbttn = () => {
    var _a;
    const gameButtons = document.createElement("div");
    gameButtons.className = "game-buttons";
    const getContainer = document.querySelector("#controls");
    getContainer == null ? void 0 : getContainer.appendChild(gameButtons);
    const getGameButton = document.querySelector(".game-buttons");
    const round2 = document.createElement("button");
    round2.type = "button";
    round2.textContent = "START ROUND";
    round2.id = "start-round";
    getGameButton == null ? void 0 : getGameButton.append(round2);
    (_a = document.getElementById("start-round")) == null ? void 0 : _a.addEventListener("click", () => {
      var sound = new import_howler2.Howl({
        src: [roundSnd],
        volume: 0.75
      });
      sound.play();
      game.autoGuesser();
    });
  };
  var nextRound = () => {
    const nxtround = document.createElement("button");
    nxtround.type = "button";
    nxtround.id = "next";
    nxtround.textContent = "NEXT ROUND";
    const getGameButtons = document.querySelector(".game-buttons");
    getGameButtons == null ? void 0 : getGameButtons.appendChild(nxtround);
  };
  var fastRound = () => {
    var _a;
    const fast = document.createElement("button");
    fast.type = "button";
    fast.id = "fast";
    fast.className = ".oj-fwk-icon-checkbox-mixed:before";
    const getGameButtons = document.querySelector(".game-buttons");
    getGameButtons == null ? void 0 : getGameButtons.appendChild(fast);
    (_a = document.getElementById("fast")) == null ? void 0 : _a.addEventListener("click", () => {
      var correctG = new import_howler2.Howl({
        src: [guessCorrect],
        format: ["mp3"],
        volume: 0.75
      });
      var idG = correctG.play();
      correctG.rate(1.5, idG);
      game.autoGuess();
    });
  };
  var phrase = json.words;
  var round = 0;
  document.addEventListener("DOMContentLoaded", (event) => {
    var _a;
    game = buildGame(phrase[round], true, 200);
    const alpha = document.getElementsByClassName("alphabet-container hidden")[0];
    alpha.classList.remove("hidden");
    introScreen();
    endScreen();
    (_a = document.querySelector(".btn-start")) == null ? void 0 : _a.addEventListener("click", function() {
      startbttn();
      nextRound();
      resetRound();
      fastRound();
    });
  });
})();
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/
