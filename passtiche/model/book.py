import logging
import time, datetime
from google.appengine.ext import db
from model.base import BaseModel
import model.util.properties
from model.user import User
from model.ibooks import iBook, iBookReader, iBookOwnedBook, iBookPublisher

class Book(BaseModel):
    """ Book Project """ 

    name = db.StringProperty(required=False)
    description = db.TextProperty(required=False)
    creator = db.ReferenceProperty(User, collection_name='books')
    ibook = db.ReferenceProperty(iBook, collection_name='projects')
    test_ibook = db.BooleanProperty(default=False)
    publisher_name = db.StringProperty(required=False)
    category = db.StringProperty(required=False)
    url = db.StringProperty(required=False)
    fb_url = db.StringProperty(required=False) # just used for input
    fb_page = db.StringProperty(required=False)
    twitter = db.StringProperty(required=False)     
    widget_info = model.util.properties.PickledProperty(default=[])  
    edited = db.DateTimeProperty(required=False)  
    published = db.BooleanProperty(default=False)     

    thumbnail = db.StringProperty(required=False) # for an ID of static thumbnails
    thumbnail_key = db.StringProperty(required=False) # key of uploaded thumbnail 
    img_url = db.StringProperty(required=False) # ibook img
    
    # platforms
    on_ibooks = db.BooleanProperty(default=False)  
    on_kindle = db.BooleanProperty(default=False)  
    on_nook = db.BooleanProperty(default=False) 
    on_other = db.BooleanProperty(default=False) 
    
    files = model.util.properties.PickledProperty(default=[]) 
    
    example_data = db.BooleanProperty(default=True) 
    example_data2 = db.BooleanProperty(default=False) 
    example_data3 = db.BooleanProperty(default=False)  
        
    view_info = model.util.properties.PickledProperty(default=[])
    # list of dicts containing info for a view
    view_count = db.IntegerProperty(default=0)
    readers = db.IntegerProperty(default=0)
    
    def get_name(self, limit=None):
        name = self.name or "My Book"
        if limit:
            from utils.string import truncate_by_words_if_long
            name = truncate_by_words_if_long(name, limit)         
        return name

                
    def get_description(self, limit=50):
        description = self.description or "No description"
        from utils.string import truncate_by_words_if_long
        return truncate_by_words_if_long(description, limit)   
    
    def thumbnail_url(self, filename=False):
        def get_url():
            if self.thumbnail_key:
                return 'book_thumbnail/%s' % self.thumbnail_key
            if self.img_url:
                return self.img_url
            import random
            n = random.randint(1,4)    
            return 'static/images/default_book_icon%s.png' % n
                                     
        url = get_url()
        from utils.gae import base_url
        return '%s/%s' % (base_url(), url)
    
    def widget_thumbnail_url(self):
        from model.widget import Widget
        widget = self.widgets.get()
        if not widget:
            return 
        return widget.thumbnail_url()
        
    
    def get_ibook(self):
        if getattr(self,'__ibook',None):
            return self.__ibook
        if self.ibook:
            self.__ibook = self.ibook
        else:
            # TODO: proofing ibook entity needs to be created
            self.__ibook = create_test_ibook(self)
            self.test_ibook = True
            self.put()
        return self.__ibook
                
    def last_viewed(self, **kwargs):
        if not self.view_info:
            return None
        return self.time_since(time_val=self.view_info[0]['time'], **kwargs)
    
    def last_edited(self, **kwargs):
        return self.time_since(time_val=self.edited, **kwargs)
        
    def widget_data(self, days=7):
        from backend.analytics import widget_data
        return widget_data(self, days=days)
        
    def sorted_widgets(self):
        widgets = self.widgets.fetch(1000)
        widgets = sorted(widgets, key=lambda x: x.edited, reverse=True)
        return widgets
    
    def view_sparkline(self, output_list=True):
        import random
        data = []
        for i in range(10):
            data.append(random.randint(1,20))
        if output_list: return data
        return ",".join([str(d) for d in data])
        
    def fb_url_formatted(self):
        if not self.fb_url: return ''
        import urllib
        return urllib.quote_plus(self.fb_url)
    
    def conversion_rate(self):
        import random
        return random.randint(3,9)

def create_test_ibook(book):
    import random
    book_id = int('8080808' + str(random.randint(1000,99999))) # easy to recognize
    new_ibook = iBook(key_name=str(book_id), ibook_id=book_id,price=.99)
    new_ibook.chapters = 30
    new_ibook.status = 'test'
    
    ibook_publisher_id = str(book_id)[-1]
    ibook_publisher = iBookPublisher.get_by_key_name('test_%s' % ibook_publisher_id)
    if not ibook_publisher:
        ibook_publisher = iBookPublisher(key_name='test_%s' % ibook_publisher_id,
            name='Test Publisher %s' % ibook_publisher_id)
        ibook_publisher.put()
    
    new_ibook.publisher = ibook_publisher
    new_ibook.publisher_name = ibook_publisher.name
    new_ibook.put()
    
    book.ibook = new_ibook
    book.put()
    
    from utils.gae import Debug
    if Debug() and book.example_data: # use this to optionally create test book owner
        create_test_ibook_owners(book, new_ibook)
    return new_ibook



def create_test_ibook_owners(book, ibook):
    import random
    
    owners = 5
    save = []
    
    ibooks = [b for b in iBook.all().fetch(100) if b.key() != ibook.key()]
    if len(ibooks) > 10:
        ibooks = random.sample(ibooks, 10)
    ibooks.append(ibook)
    def test_owned_book(o, ib, is_purchase=False):
        new_owned_book = iBookOwnedBook(reader=new_reader, ibook=ib)
        new_owned_book.status = 'test'
        from utils.time import days_ago
        new_owned_book.last_read = None # days_ago(random.randint(1,40))
        new_reader.ibooks.append(ib.key())
        new_owned_book.chapters = ib.chapters
        if random.randint(0,10) > 3:
            new_owned_book.ibookstore = True
        if not is_purchase and (new_owned_book.ibookstore and random.randint(0,10) > 5):
            new_owned_book.sample = True
        new_owned_book.chapter = random.randint(1,ib.chapters or 1) 
        save.append(new_owned_book)
        return new_owned_book
                    
    from backend.ibooks import DEFAULT_INCOME_DICT, DEFAULT_AGE_DICT
    for o in range(owners):
        
        new_reader = iBookReader(apple_id=str(book.key()) + "_" + str(o))
        new_reader.status = 'test'
        new_reader.age = random.choice(DEFAULT_AGE_DICT.keys())
        logging.info('saving new reader, %s years old' % new_reader.age)
        new_reader.lat = float(random.randint(37,40))
        new_reader.lng = float(random.randint(-122,-74))
        new_reader.income = random.choice(DEFAULT_INCOME_DICT.keys()).lstrip('$')
                        
        db.put(new_reader)
        for ib in ibooks:
            new_owned_book = test_owned_book(o,ib)
            # mimic readers who bought book after downloading sample
            if new_owned_book.sample:
                if random.randint(0,10) > 6:
                    logging.info('sample reader purchasing book')
                    new_owned_book = test_owned_book(o,ib, is_purchase=True)
                else:
                    logging.info('sample reader not purchasing book')
        save.append(new_reader)

        
    logging.info('saving %d ibook owned book' % len(save))
    db.put(save)

class BookDocument(BaseModel):
    '''
    '''

    book = db.ReferenceProperty(Book, collection_name='document')
    url = db.StringProperty()  # filepicker.io
    filename = db.StringProperty()
    # version number?
    
class BookThumbnail(BaseModel):
    '''
    '''

    book = db.ReferenceProperty(Book, collection_name='uploaded_thumbnail')
    image = db.BlobProperty()  
    # this is just for record keeping
    deleted = db.BooleanProperty(default=False)       
    