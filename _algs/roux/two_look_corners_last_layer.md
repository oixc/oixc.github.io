---
title: Roux
description: Two Look Corners Last Layer (CMLL)
layout: algorithms
dataset: roux_two_look_cmll
dataset_columns: [name,orient_or_permute,comment]
sorts:
    - name: name
      key: name
    - name: orient/permute
      key: orient_or_permute
filters:
    - name: name
      key: name
    - name: orient/permute
      key: orient_or_permute
---

* permute last layer corners, then permute
* algs from [cubingapp.com](https://cubingapp.com/algorithms/2-Look-CMLL/)
