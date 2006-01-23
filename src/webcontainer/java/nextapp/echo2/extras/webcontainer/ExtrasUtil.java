package nextapp.echo2.extras.webcontainer;

import nextapp.echo2.webrender.Service;
import nextapp.echo2.webrender.ServiceRegistry;
import nextapp.echo2.webrender.WebRenderServlet;
import nextapp.echo2.webrender.service.JavaScriptService;
import nextapp.echo2.webrender.service.StaticBinaryService;

public class ExtrasUtil {

    public static final String IMAGE_RESOURCE_PATH = "/nextapp/echo2/extras/webcontainer/resource/image/";
    
    public static final Service TRANSPARENT_IMAGE_SERVICE= StaticBinaryService.forResource(
            "Echo2Extras.ExtrasUtil.Transparent", "image/gif", IMAGE_RESOURCE_PATH + "Transparent.gif");
    
    /**
     * Service to provide supporting JavaScript library.
     */
    public static final Service JS_EXTRAS_UTIL_SERVICE = JavaScriptService.forResource("Echo2Extras.Util",
            "/nextapp/echo2/extras/webcontainer/resource/js/ExtrasUtil.js");

    static {
        ServiceRegistry services = WebRenderServlet.getServiceRegistry();
        services.add(JS_EXTRAS_UTIL_SERVICE);
        services.add(TRANSPARENT_IMAGE_SERVICE);
    }
}
