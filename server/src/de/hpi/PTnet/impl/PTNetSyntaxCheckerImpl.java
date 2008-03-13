package de.hpi.PTnet.impl;

import java.util.ArrayList;
import java.util.List;

import de.hpi.PTnet.PTNet;
import de.hpi.petrinet.FlowRelationship;
import de.hpi.petrinet.Node;
import de.hpi.petrinet.Place;
import de.hpi.petrinet.impl.PetriNetSyntaxCheckerImpl;

public class PTNetSyntaxCheckerImpl extends PetriNetSyntaxCheckerImpl {
	
	private static final String NO_DISTINGUISHED_START_PLACE = "There is no distinguished start place.";
	private static final String NO_DISTINGUISHED_END_PLACE = "There is no distinguished end place.";
	private static final String NOT_CONNECTED = "Not all places and transitions lie on a path from the start place to the end place.";
	
	public PTNetSyntaxCheckerImpl(PTNet net) {
		super(net);
	}
	
	public boolean isWorkflowNet() {
		boolean foundStartPlace = false;
		boolean foundEndPlace = false;
		
		for (Place p: net.getPlaces()) {
			if (p.getIncomingFlowRelationships().size() == 0) {
				if (foundStartPlace) {
					errorCode = NO_DISTINGUISHED_START_PLACE;
					return false;
				}
				foundStartPlace = true;
			}
			if (p.getOutgoingFlowRelationships().size() == 0) {
				if (foundEndPlace) {
					errorCode = NO_DISTINGUISHED_END_PLACE;
					return false;
				}
				foundEndPlace = true;
			}
		}
		if (!foundStartPlace && !foundEndPlace)
			return false;
		
		List<Node> allNodes = new ArrayList();
		allNodes.addAll(net.getPlaces());
		allNodes.addAll(net.getTransitions());
		removeConnectedNodesFromList(allNodes.get(0), allNodes);
		if (allNodes.size() > 0) {
			errorCode = NOT_CONNECTED;
			return false;
		}

		return true;
	}

	private void removeConnectedNodesFromList(Node node, List<Node> allNodes) {
		if (!allNodes.contains(node))
			return;
		allNodes.remove(node);
		
		for (FlowRelationship rel: node.getIncomingFlowRelationships())
			removeConnectedNodesFromList(rel.getSource(), allNodes);
		for (FlowRelationship rel: node.getOutgoingFlowRelationships())
			removeConnectedNodesFromList(rel.getTarget(), allNodes);
	}

}