---
title: Roux
description: First Block Last Pair
layout: algorithms
dataset: roux_fblp_3_moves
dataset_columns: [name,name_cuberoot,corner_LFD,edge_LF,alg,move_count]
filters:
    - name: corners
      key: corner_lfd‎
    - name: edges
      key: edge_lf
    - name: moves
      key: move_count

sorts:
    - name: corners
      key: corner_lfd‎
    - name: edges
      key: edge_lf
---

algs from [cuberoot.me](https://www.cuberoot.me/roux-fblp/).

we are placing the `LFD` corner and `LF` edge
* edge label `LF` indicates the edge in the correct position and orientation
* edge label `FL` indicates the edge in the correct position but **wrong** orientation 
* edge label `UR` indicates the edge's original `L` face color is on `U` and it's original `F` face color is on `R`

