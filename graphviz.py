#!/usr/bin/env python

"""
Pandoc filter to process code blocks with class "graph" into
graphviz-generated images.
Requires pygraphviz, pandocfilters
"""

import os
import sys

import pygraphviz

from pandocfilters import toJSONFilter, RawBlock
from pandocfilters import get_value

def graphviz(key, value, format, _):
    if key == 'CodeBlock':
        [[ident, classes, keyvals], code] = value
        if "graph" in classes:
            prog, keyvals = get_value(keyvals, u"prog", u"dot")

            g = pygraphviz.AGraph(string=code)
            g.layout()
            svg = g.draw(None, 'svg', prog=prog).strip().decode()
            return RawBlock('html', svg)

if __name__ == "__main__":

    toJSONFilter(graphviz)