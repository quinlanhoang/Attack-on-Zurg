//referenced from Altice

class Dialogue extends Phaser.Scene {
  constructor() {
    super("Dialogue");
  }
  init() {
        
    // dialog constants
        this.DBOX_X = -450  // dialog box x-position
        this.DBOX_Y = 1000 	    // dialog box y-position
        this.DBOX_FONT = 'edit'	        // dialog box font key

        this.TEXT_X = 375		    // text w/in dialog box x-position
        this.TEXT_Y = 345			    // text w/in dialog box y-position
        this.TEXT_SIZE = 32		        // text font size (in pixels)
        this.TEXT_MAX_WIDTH = 715	    // max width of text within box

        this.NEXT_TEXT = '[SPACE]'	    // text to display for next prompt
        this.NEXT_X = 800			    // next text prompt x-position
        this.NEXT_Y = 474			    // next text prompt y-position

        this.LETTER_TIMER = 15		    // # ms each letter takes to "type" onscreen

        // dialog variables
        this.dialogConvo = 0			// current "conversation"
        this.dialogLine = 0			    // current line of conversation
        this.dialogSpeaker = null		// current speaker
        this.dialogLastSpeaker = null	// last speaker
        this.dialogTyping = false		// flag to lock player input while text is "typing"
        this.dialogText = null			// the actual dialog text
        this.nextText = null			// player prompt text to continue typing

        // character variables
        this.tweenDuration = 500        // character in/out tween duration

        this.OFFSCREEN_X = -1000         // x,y coordinates used to place characters offscreen
        this.OFFSCREEN_Y = 750
    }

    create() {
        //background
        this.background = this.add.tileSprite(0, 0, w, h, 'background').setOrigin(0, 0)
        this.stars = this.add.tileSprite(0, 0, w, h, 'stars').setOrigin(0, 0)
        this.wallTexture = this.add.tileSprite(0, 0, w, h, 'wallTexture').setOrigin(0, 0)

        // parse dialog from JSON file
        this.dialog = this.cache.json.get('dialog')
        //console.log(this.dialog)

        // add dialog box sprite
        this.dialogbox = this.add.sprite(this.DBOX_X, this.DBOX_Y, 'dialogbox').setOrigin(0)

        // initialize dialog text objects (with no text)
        this.dialogText = this.add.bitmapText(this.TEXT_X, this.TEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)
        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, '', this.TEXT_SIZE)

        this.buzz = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'buzz').setOrigin(0, 1).setScale(5)
        this.zurg = this.add.sprite(this.OFFSCREEN_X, this.DBOX_Y+8, 'zurg').setOrigin(0, 1).setScale(5)
        // input
        cursors = this.input.keyboard.createCursorKeys()

        // start first dialog conversation
        this.typeText()        
    }

    update() {
        //background
        this.stars.tilePositionX -= 1
        this.wallTexture.tilePositionY -= 1
        
        // check for spacebar press
        if(Phaser.Input.Keyboard.JustDown(cursors.space) && !this.dialogTyping) {
            this.typeText() // trigger dialog
        }

    }

    typeText() {
        // lock input while typing
        this.dialogTyping = true

        // clear text
        this.dialogText.text = ''
        this.nextText.text = ''

        /* JSON dialog structure: 
            - each array within the main JSON array is a "conversation"
            - each object within a "conversation" is a "line"
            - each "line" can have 3 properties: 
                1. a speaker (required)
                2. the dialog text (required)
                3. an (optional) flag indicating if this speaker is new
        */

        // make sure there are lines left to read in this convo, otherwise jump to next convo
        if(this.dialogLine > this.dialog[this.dialogConvo].length - 1) {
            this.dialogLine = 0
            // I increment the conversation count here...
            // ..but you could create logic to exit if each conversation was self-contained
            this.dialogConvo++
        }
        
        // make sure we haven't run out of conversations...
        if(this.dialogConvo >= this.dialog.length) {
            // here I'm exiting the final conversation to return to the title...
            // ...but you could add alternate logic if needed
            console.log('End of Conversations')
            // tween out prior speaker's image
            if(this.dialogLastSpeaker) {
                this.tweens.add({
                    targets: this[this.dialogLastSpeaker],
                    x: this.OFFSCREEN_X,
                    duration: this.tweenDuration,
                    ease: 'Linear',
                    onComplete: () => {
                        this.scene.start('Play')
                    }
                })
            }
            // make text box invisible
            this.dialogbox.visible = false

        } else {
            // if not, set current speaker
            this.dialogSpeaker = this.dialog[this.dialogConvo][this.dialogLine]['speaker']
            // check if there's a new speaker (for exit/enter animations)
            if(this.dialog[this.dialogConvo][this.dialogLine]['newSpeaker']) {
                // tween out prior speaker's image
                if(this.dialogLastSpeaker) {
                    this.tweens.add({
                        targets: this[this.dialogLastSpeaker],
                        x: this.OFFSCREEN_X,
                        duration: this.tweenDuration,
                        ease: 'Linear'
                    })
                }
                // tween in new speaker's image
                this.tweens.add({
                    targets: this[this.dialogSpeaker],
                    x: this.DBOX_X + 500,
                    duration: this.tweenDuration,
                    ease: 'Linear'
                })
            }

            // build dialog (concatenate speaker + colon + line of text)
            this.combinedDialog = 
                this.dialog[this.dialogConvo][this.dialogLine]['speaker'].toUpperCase() 
                + ': ' 
                + this.dialog[this.dialogConvo][this.dialogLine]['dialog']

            // create a timer to iterate through each letter in the dialog text
            let currentChar = 0
            this.textTimer = this.time.addEvent({
                delay: this.LETTER_TIMER,
                repeat: this.combinedDialog.length - 1,
                callback: () => { 
                    // concatenate next letter from dialogLines
                    this.dialogText.text += this.combinedDialog[currentChar]
                    // advance character position
                    currentChar++
                    // check if timer has exhausted its repeats 
                    // (necessary since Phaser 3 no longer seems to have an onComplete event)
                    if(this.textTimer.getRepeatCount() == 0) {
                        // show prompt for more text
                        this.nextText = this.add.bitmapText(this.NEXT_X, this.NEXT_Y, this.DBOX_FONT, this.NEXT_TEXT, this.TEXT_SIZE).setOrigin(1)
                        this.dialogTyping = false   // un-lock input
                        this.textTimer.destroy()    // destroy timer
                    }
                },
                callbackScope: this // keep Scene context
            })
            
            // final cleanup before next iteration
            this.dialogText.maxWidth = this.TEXT_MAX_WIDTH  // set bounds on dialog
            this.dialogLine++                               // increment dialog line
            this.dialogLastSpeaker = this.dialogSpeaker     // set past speaker
        }
    }
    
}