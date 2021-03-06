(ns nevergreen.wrap-content-security-policy
  (:require [clojure.string :refer [starts-with? join]]
            [ring.util.response :refer [get-header]]))

(def ^:private default-src "default-src 'self'")
(def ^:private script-src "script-src 'self' 'unsafe-eval'")
(def ^:private worker-src "worker-src 'self'")
(def ^:private style-src "style-src 'self' 'unsafe-inline'")
(def ^:private img-src "img-src * data:")
(def ^:private font-src "font-src 'self' data:")
(def ^:private media-src "media-src *")
(def ^:private connect-src "connect-src 'self' https://api.github.com https://gist.githubusercontent.com")
(def ^:private object-src "object-src 'none'")
(def ^:private child-src "child-src 'self'")
(def ^:private frame-src "frame-src 'none'")
(def ^:private sources [default-src script-src worker-src style-src img-src font-src media-src connect-src object-src child-src frame-src])

(defn wrap-content-security-policy [app]
  (fn [req]
    (let [res (app req)]
      (assoc-in res [:headers "Content-Security-Policy"] (join "; " sources)))))
