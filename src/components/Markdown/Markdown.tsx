/*
 * Copyright (C) 2012-2017  Online-Go.com
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import * as React from "react";
import * as commonmark from "commonmark";

interface MarkdownProps {
    source: string;
}

let parser = new commonmark.Parser();
let renderer = new commonmark.HtmlRenderer();

export class Markdown extends React.PureComponent<MarkdownProps, {html}> {
    constructor(props) {
        super(props);
        this.state = {
            html: this.props.source ? renderer.render(parser.parse(this.massage(this.props.source))) : ""
        };
    }

    massage(source: string): string {
        source = source.replace(/^(#+)([a-zA-Z0-9])/g, "$1 $2"); // headers used to behave like this
        source = source.replace(/<script/ig, "(script"); // hasnt' been exploitable yet with how react works i don't think, but they leave most html intact for some stupid reason, this string shouldn't exist anyways
        return source;
    }

    componentWillReceiveProps(next_props) {{{
        if (next_props.source !== this.props.source) {
            this.setState({
                html: next_props.source ? renderer.render(parser.parse(this.massage(next_props.source))) : ""
            });
        }
    }}}

    render() {
        return (
            <div dangerouslySetInnerHTML={ {__html: this.state.html } } />
        );
    }
}
