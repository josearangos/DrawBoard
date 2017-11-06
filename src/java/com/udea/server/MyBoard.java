
package com.udea.server;
import com.udea.board.Figure;
import com.udea.board.FigureDecoder;
import com.udea.board.FigureEncoder;
import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint(value = "/DrawBoard", encoders = {FigureEncoder.class}, decoders = {FigureDecoder.class})
public class MyBoard {
    private static Set<Session> peers = Collections.synchronizedSet(new HashSet<Session>());
    @OnMessage
    public void broadcastFigure(Figure figure, Session session) throws IOException, EncodeException {
        for (Session peer : peers) {
            if (!peer.equals(session)) {
                peer.getBasicRemote().sendObject(figure);
            }
        }
    }

    @OnOpen
    public void onOpen(Session peer) {
        peers.add(peer);
    }

    @OnClose
    public void onClose(Session peer) {
        peers.remove(peer);
    }
}


