(ns nevergreen.wrap-cache-control
  (:require [clojure.string :refer [starts-with?]]
            [ring.util.response :refer [get-header]]))

(defn wrap-no-cache [app]
  (fn [req]
    (let [res (app req)]
      (assoc-in res [:headers "Cache-Control"] "private, max-age=0, no-store"))))

(defn wrap-caching [app]
  (fn [req]
    (let [res (app req)]
      (assoc-in res [:headers "Cache-Control"] "max-age=31556926"))))
