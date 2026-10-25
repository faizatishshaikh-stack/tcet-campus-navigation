/**
 * Generates natural pedestrian step-by-step navigation directions from a calculated route.
 */

export class DirectionsGenerator {
  static generateSteps(graph, path, edges) {
    if (!path || path.length === 0) return [];

    if (path.length === 1) {
      const v = graph.getVertex(path[0]);
      return [{
        instruction: `You are already at ${v?.name || path[0]}.`,
        distance: 0,
        subtext: 'Starting location and destination are identical.',
        type: 'arrive'
      }];
    }

    const steps = [];
    const startVertex = graph.getVertex(path[0]);
    const firstEdge = edges[0];

    // Initial Departure Step
    steps.push({
      stepNumber: 1,
      type: 'depart',
      instruction: `Depart from ${startVertex?.name || path[0]}`,
      subtext: `Head onto ${firstEdge?.name || 'the campus pathway'}`,
      distance: 0,
      icon: 'Footprints'
    });

    let cumulativeDist = 0;

    for (let i = 0; i < edges.length; i++) {
      const edge = edges[i];
      const fromNode = graph.getVertex(edge.source);
      const toNode = graph.getVertex(edge.target);
      cumulativeDist += edge.weight;

      const isLast = (i === edges.length - 1);
      const nextEdge = !isLast ? edges[i + 1] : null;

      // Determine heading / direction cue
      let cue = 'Continue straight along';
      if (i > 0) {
        cue = 'Follow';
      }

      steps.push({
        stepNumber: steps.length + 1,
        type: isLast ? 'arrive' : 'walk',
        instruction: isLast
          ? `Walk ${edge.weight}m along ${edge.name} to arrive at ${toNode?.name}`
          : `${cue} ${edge.name} for ${edge.weight}m toward ${toNode?.name}`,
        subtext: `Surface: ${edge.surface || 'Paved pathway'} • Approx ${Math.max(1, Math.round(edge.weight / 80))} min walk`,
        distance: edge.weight,
        cumulativeDistance: cumulativeDist,
        locationName: toNode?.name,
        locationCode: toNode?.code,
        icon: isLast ? 'MapPin' : 'ArrowRight'
      });
    }

    return steps;
  }
}
