package bd.examarena.app;
import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.content.Intent;
import android.net.Uri;
public class MainActivity extends Activity {
 private WebView web;
 private static final String SITE="https://mehedialimayon-del.github.io/examarena-bd/";
 @Override public void onCreate(Bundle state){super.onCreate(state);web=new WebView(this);web.getSettings().setJavaScriptEnabled(true);web.getSettings().setDomStorageEnabled(true);web.getSettings().setAllowFileAccess(false);web.getSettings().setAllowContentAccess(false);web.setWebChromeClient(new WebChromeClient());web.setWebViewClient(new WebViewClient(){
 @Override public boolean shouldOverrideUrlLoading(WebView v,WebResourceRequest req){Uri u=req.getUrl();if("https".equals(u.getScheme())&&"mehedialimayon-del.github.io".equals(u.getHost())&&u.getPath().startsWith("/examarena-bd/"))return false;try{startActivity(new Intent(Intent.ACTION_VIEW,u));}catch(Exception ignored){}return true;}
 });setContentView(web);web.loadUrl(SITE);}
 @Override public void onBackPressed(){if(web!=null&&web.canGoBack())web.goBack();else super.onBackPressed();}
 @Override protected void onDestroy(){if(web!=null){web.destroy();web=null;}super.onDestroy();}
}
