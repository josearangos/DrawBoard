



package com.udea.board;
import java.io.StringWriter;
import javax.json.Json;
import javax.json.JsonObject;

public class Figure {
    
    private JsonObject json; 
    
    public JsonObject getJson() {
        return json;
    }

    public void setJson(JsonObject json) {
        this.json = json;
    }

    public Figure(JsonObject json) {
        this.json = json;
    }

    // Idiom para que manipule la figura
    @Override
    public String toString() {     
   
        StringWriter write = new StringWriter();
        Json.createWriter(write).write(json);
        return write.toString();       
        
    }    
}






