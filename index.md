---
title: Cube Algorithms
description: collection of algs
layout: default
---

{% for alg in site.algs %}
  * [{{ alg.title }} - {{ alg.description }}]({{ alg.url }})
{% endfor %}
