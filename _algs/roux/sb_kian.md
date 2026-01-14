---
title: Roux
description: Second Block (Kian)
datasets: [roux_sb_kian]
dataset_columns: [name,alg,corner_RFD,edge_RF,description,corner_layer,edge_layer,group,alternatives,move_count,alg_rank_kian]
sorts:
    - name: name
      key: name
    - name: corner
      key: corner_RFD
    - name: edge
      key: edge_RF
    - name: corner_layer
      key: corner_layer
    - name: edge_layer
      key: edge_layer
    - name: moves
      key: move_count
    - name: rank
      key: alg_rank
filters:
    - name: name
      key: name
    - name: corner
      key: corner_RFD
    - name: edge
      key: edge_RF
    - name: corner_layer
      key: corner_layer
    - name: edge_layer
      key: edge_layer
    - name: moves
      key: move_count
    - name: rank
      key: alg_rank
---

from [Kian Mansour](https://sites.google.com/view/kianroux/second-block)
