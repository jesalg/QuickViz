#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Pandoc filter to process code blocks with class "graph" into
graphviz-generated images.
Requires pygraphviz, pandocfilters
"""

import os
import sys

import pygraphviz

from pandocfilters import toJSONFilter, Para, RawBlock, Image, get_filename4code
from pandocfilters import get_caption, get_extension, get_value

def graphviz(key, value, format, _):
    if key == 'CodeBlock':
        [[ident, classes, keyvals], code] = value
        if "graph" in classes:
            prog, keyvals = get_value(keyvals, 'prog', 'dot')
            g = pygraphviz.AGraph(string=code.strip().decode())
            g.layout()
            return RawBlock('html', g.draw(None, 'svg', prog=prog))

if __name__ == "__main__":

    toJSONFilter(graphviz)