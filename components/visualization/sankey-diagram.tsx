"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SankeyNode {
  id: string
  label: string
  value: number
}

interface SankeyLink {
  source: string
  target: string
  value: number
}

interface SankeyDiagramProps {
  nodes: SankeyNode[]
  links: SankeyLink[]
  title: string
  description?: string
}

export function SankeyDiagram({ nodes, links, title, description }: SankeyDiagramProps) {
  const totalValue = links.reduce((sum, link) => sum + link.value, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Source nodes */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Energy Sources</h4>
            {nodes
              .filter((node) => links.some((link) => link.source === node.id))
              .map((node) => {
                const nodeLinks = links.filter((link) => link.source === node.id)
                const nodeValue = nodeLinks.reduce((sum, link) => sum + link.value, 0)
                const percentage = (nodeValue / totalValue) * 100

                return (
                  <div key={node.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{node.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {nodeValue.toFixed(1)} kWh ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-primary transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                    {/* Flow lines */}
                    <div className="pl-4 space-y-1">
                      {nodeLinks.map((link) => {
                        const linkPercentage = (link.value / nodeValue) * 100
                        const targetNode = nodes.find((n) => n.id === link.target)
                        return (
                          <div key={`${link.source}-${link.target}`} className="flex items-center gap-2 text-xs">
                            <div className="h-px flex-1 bg-border" />
                            <span className="text-muted-foreground">
                              {linkPercentage.toFixed(0)}% → {targetNode?.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>

          {/* Target nodes */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground">Energy Consumption</h4>
            {nodes
              .filter((node) => links.some((link) => link.target === node.id))
              .map((node) => {
                const nodeLinks = links.filter((link) => link.target === node.id)
                const nodeValue = nodeLinks.reduce((sum, link) => sum + link.value, 0)
                const percentage = (nodeValue / totalValue) * 100

                return (
                  <div key={node.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{node.label}</span>
                      <span className="text-sm text-muted-foreground">
                        {nodeValue.toFixed(1)} kWh ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                      <div className="h-full bg-green-500 transition-all" style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
