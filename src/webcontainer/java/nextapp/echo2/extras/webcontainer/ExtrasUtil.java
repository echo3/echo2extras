package nextapp.echo2.extras.webcontainer;

import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.service.JavaScriptService;

public class ExtrasUtil {

    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service SERVICE = JavaScriptService.forResource("Echo2Extras.Util",
            "/nextapp/echo2/extras/webcontainer/resource/js/ExtrasUtil.js");

    static {
        WebRenderServlet.getServiceRegistry().add(SERVICE);
    }
}
