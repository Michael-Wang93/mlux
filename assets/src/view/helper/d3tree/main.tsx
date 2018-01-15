import * as d3 from 'd3'
import './main.css'
import * as React from 'react';
import * as uuid from 'uuid'


export interface TreeData{
    name:string
    children:Array<TreeData>
}

export interface ITreeProps{
    Width: number
    Height: number
    OnNodeExtend?():void
    OnNodeClose?():void
    OnNodeClick?(d:any):void
    Data:TreeData
}
export class Tree extends React.Component<ITreeProps, {}> {
    private Svg:any

    private Duration = 500;

    private MaxLabel = 150;

    private I =0;

    private Uuid :string;

    private Radius = 5;

    private Data:any

    private Tree:any

    private Diagonal:any

    constructor(props:ITreeProps) {
        super(props);
        let data:any = this.props.Data;
        data.x0 = 0;
        data.y0 = 0;
        data.children.forEach((d:any)=>{this.collapse(d)});
        this.Data = JSON.parse(JSON.stringify(data));
        let _uuid = uuid.v1().split('-').pop()
        this.Uuid = 'a' + _uuid.slice(_uuid.length-5,_uuid.length);
        this.Diagonal = d3.svg.diagonal().projection( (d:any) => { return [d.y, d.x]; });
        this.Tree = d3.layout.tree().size([this.props.Height, this.props.Width]);
    }

    componentDidMount(){
        this.Svg = d3.select("#"+this.Uuid)
            .attr("width", this.props.Width)
            .attr("height", this.props.Height)
            .append("g")
            .attr("transform", "translate(100,0)");
        this.initNodes();
    }

    private collapse(d:any){
        if (d.children) {
            d._children = d.children;
            d._children.forEach((d:any)=>{this.collapse(d)});
            d.children = null;
        }
    }

    private click(d:any) {
        if (d.children) {
            d._children = d.children;
            d.children = null;
        }
        else {
            d.children = d._children;
            d._children = null;
        }
        if(this.props.OnNodeClick){
            this.props.OnNodeClick(d);
        }
        this.initNodes();
    }

    private nbEndNodes(n:any) {
        let nb = 0;
        if (n.children) {
            n.children.forEach( (c:any) => {
                nb += this.nbEndNodes(c);
            });
        }
        else if (n._children) {
            n._children.forEach( (c:any) => {
                nb += this.nbEndNodes(c);
            });
        }
        else nb++;

        return nb;
    }

    private computeRadius(d:any) {
        if (d.children || d._children) return this.Radius + (this.Radius * this.nbEndNodes(d) / 10);
        else return this.Radius;
    }

    private initNodes(){
        var nodes = this.Tree.nodes(this.Data).reverse();
        var links = this.Tree.links(nodes);
        nodes.forEach((d:any) => { d.y = d.depth * this.MaxLabel; });
        var node = this.Svg.selectAll("g.node")
            .data(nodes,  (d:any) => {
                return d.id || (d.id = ++this.I);
            });
        var nodeEnter = node.enter()
            .append("g")
            .attr("class", "node")
            .attr("transform", (d:any) => { return "translate(" + this.Data.y0 + "," + this.Data.x0 + ")"; })
            .on("click", (d:any) => { this.click(d) });

        nodeEnter.append("circle")
            .attr("r", 0)
            .style("fill",  (d:any) => {
                return d._children ? "lightsteelblue" : "white";
            });

        nodeEnter.append("text")
            .attr("x",  (d:any) => {
                var spacing = this.computeRadius(d) + 5;
                return d.children || d._children ? -spacing : spacing;
            })
            .attr("dy", "3")
            .attr("text-anchor",  (d:any) => { return d.children || d._children ? "end" : "start"; })
            .text( (d:any) => { return d.name; })
            .style("fill-opacity", 0);

        var nodeUpdate = node.transition()
            .duration(this.Duration)
            .attr("transform",  (d:any) => { return "translate(" + d.y + "," + d.x + ")"; });

        nodeUpdate.select("circle")
            .attr("r",  (d:any) => { return this.computeRadius(d); })
            .style("fill",  (d:any) => { return d._children ? "lightsteelblue" : "#fff"; });

        nodeUpdate.select("text").style("fill-opacity", 1);

        var nodeExit = node.exit().transition()
            .duration(this.Duration)
            .attr("transform",  (d:any) => { return "translate(" + this.Data.y + "," + this.Data.x + ")"; })
            .remove();
        nodeExit.select("circle").attr("r", 0);
        nodeExit.select("text").style("fill-opacity", 0);
        var link = this.Svg.selectAll("path.link")
            .data(links,  (d:any) => { return d.target.id; });
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("d",  (d:any) => {
                var o = { x: this.Data.x0, y: this.Data.y0 };
                return this.Diagonal({ source: o, target: o });
            });

        link.transition()
            .duration(this.Duration)
            .attr("d", this.Diagonal);

        link.exit().transition()
            .duration(this.Duration)
            .attr("d",  (d:any) => {
                var o = { x: this.Data.x, y: this.Data.y };
                return this.Diagonal({ source: o, target: o });
            })
            .remove();

        nodes.forEach( (d:any) => {
            d.x0 = d.x;
            d.y0 = d.y;
        });
    }

    render() {
        return <svg id={this.Uuid}></svg>
    }
}
