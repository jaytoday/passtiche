from google.appengine.api import memcache
import gae as gae_utils
import logging

# cache is disabled by default for local development, use reset=False to override
RESET_DEFAULT = gae_utils.Debug() 

def decorator_with_args(decorator_to_enhance):
    """ 
    This function is supposed to be used as a decorator.
    It must decorate an other function, that is intended to be used as a decorator.
    Take a cup of coffee.
    It will allow any decorator to accept an arbitrary number of arguments,
    saving you the headache to remember how to do that every time.
    
    This comes from http://stackoverflow.com/questions/739654/understanding-python-decorators
    """

    # We use the same trick we did to pass arguments
    def decorator_maker(*args, **kwargs) :

        # We create on the fly a decorator that accepts only a function
        # but keeps the passed arguments from the maker .
        def decorator_wrapper(func) :

            # We return the result of the original decorator, which, after all, 
            # IS JUST AN ORDINARY FUNCTION (which returns a function).
            # Only pitfall : the decorator must have this specific signature or it won't work :
            return decorator_to_enhance(func, *args, **kwargs)

        return decorator_wrapper

    return decorator_maker

@decorator_with_args
def cache(func, *args, **kwargs):
    """
    Caches the result of a method for a specified time in seconds
    
    Use it as:
      
      @cache(time=1200)
      def functionToCache(arguments):

          @cache() - unlimited time
          def functionToCache(arguments):
                        
          @cache(reset=True) - manual reset
          def functionToCache(arguments):

          @cache(version_key=True) - resets on deployment
          def functionToCache(arguments):              
              
              
     * Note: use reset_cache query argument in URL to force cache reset
            TODO: only allow when signed in as an admin
            
    """
    def wrapper(*pars, **kpars):
        # note: only include simple kwargs
        import os
        logging.info(kpars)
        if kwargs.get('key'):
            arg_key = kpars.get(kwargs.get('key'),'')
            if not arg_key and pars:
                arg_key = pars[0]
            
        else:
            arg_key = '_'.join([str(par) for par in pars ]) + str(kpars or '')
        key = func.__name__ + '_' + str(arg_key)
        if kwargs.get('version_key', True):
            key += "_" + os.environ["CURRENT_VERSION_ID"]
        logging.info('cache key: %s' % key)
        if kwargs.get('reset', RESET_DEFAULT) or 'reset_cache' in os.environ['QUERY_STRING']:
            val = None
        else:
            val = memcache.get(key)
        logging.debug('Cache lookup for %s, found: %s', key, val != None)
        if not val:
            val = func(*pars, **kpars)
            memcache.set(key, val, time=kwargs.get('time', 0))
        return val
        
    return wrapper
