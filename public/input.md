# Quick visualizations in Markdown!

Generate accessible & semantic HTML document (or an image) with complex charts, graphs, mathematics and more using the simplicity of Markdown!

## Bar Charts    
- Dogs: 39
- Cats: 7
- Lions: 36
- Tigers: 55
- Bears: 33
- Walruses: 30

---

## Scatter Plots
- (15,12)
- (0.25,6.78)
- (-.7,9)
- (-4,-6)

---

## Line Plot
* 1.5 : 3.3
* 3 : -1.2
* 4.5 : 0
* 6 : 0
* 7.5 : 1.5
* 9 : 4
* 10.5 : 8

---

## Stacked Bar
* Dogs : 20+
* Cats : 10+
* Lions : 30+
* Tigers : 15+
* Bears : 20+

---

## Waterfall Chart
- Animals: 95=
- Dogs: 20+
- Cats: 10+
- Lions: 30+
- Tigers: 15+
- Bears: 20+

--- 

## Math
| Label        |  Description                                                        |
| :----------: | :-----------------------------------------------------------------: |
| `meanflx`    | $${\langle F\rangle=\frac{1}{N_f}\sum_i F_i}$$                      |
| `wmeanflx`   | $${\langle F\rangle_w=\frac{F_i w_i}{\sum_i w_i}}$$                 |
| `rmsflx`     | $${\sqrt{\langle F^2\rangle_w} = \sqrt{\frac{F_i^2 w_i}{\sum_i}}}$$ |

--- 

## Graph Viz

```{.graph .center caption="This was generated using the graphviz.py filter."}

digraph G {

  bgcolor="#ffffff00"

  subgraph cluster_0 {
    style="filled, rounded";
    color="#E6EAF2"
    node [style=filled,color=white];
    a0 -> a1 -> a2 -> a3;
    a3 -> a1 [label = " -10" color=red fontcolor=red];
    label = "System A";
  }

  subgraph cluster_1 {
    node [style=filled color="#E6EAF2"];
    b0 -> b1 -> b2 -> b3;
    b0 -> b2 [label = " +12" color=green fontcolor=green];
    label = "System B";
    style="dashed, rounded"
    color=blue
  }

  start -> a0;
  start -> b0;
  a1 -> b3;
  a3 -> end;
  b3 -> end;

  start [label="load" shape=folder];
  end [label="store" shape=box3d];
}
```