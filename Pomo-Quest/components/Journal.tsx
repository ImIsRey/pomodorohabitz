import React, { useState } from 'react';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import saveAs from 'file-saver';
import JournalIcon from './icons/JournalIcon';
import DownloadIcon from './icons/DownloadIcon';

const Journal: React.FC = () => {
    const [text, setText] = useState('');

    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear().toString().slice(-2)}`;

    const handleSave = () => {
        if (!text.trim()) {
            return;
        }

        const doc = new Document({
            sections: [{
                children: [
                    new Paragraph({
                        children: [
                            new TextRun({
                                text: `Journal Entry: ${formattedDate}`,
                                bold: true,
                                size: 28, // 14pt
                            }),
                        ],
                        spacing: { after: 200 },
                    }),
                    ...text.split('\n').map(line => new Paragraph({
                        children: [new TextRun(line)],
                    })),
                ],
            }],
        });

        Packer.toBlob(doc).then(blob => {
            saveAs(blob, `Journal-${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}.docx`);
        });
    };

    return (
        <div className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4 shadow-lg transition-colors">
            <h2 className="text-xl font-bold mb-4 font-pixel text-emerald-600 dark:text-emerald-400 flex items-center">
                <JournalIcon className="h-5 w-5 mr-2" />
                Let's Journaling!
            </h2>
            <div className="mb-2 text-sm font-semibold text-stone-500 dark:text-stone-400">
                {formattedDate}
            </div>
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Write your thoughts here..."
                className="w-full h-48 bg-amber-50 dark:bg-gray-700 border-2 border-amber-200 dark:border-gray-600 rounded-md p-2 focus:outline-none focus:border-emerald-500 transition-colors text-gray-800 dark:text-gray-100 resize-none"
                aria-label="Journal entry"
            />
            <button
                onClick={handleSave}
                disabled={!text.trim()}
                className="w-full mt-4 bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-md flex items-center justify-center font-semibold disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
            >
                <DownloadIcon className="h-5 w-5 mr-2" />
                Save as .docx
            </button>
        </div>
    );
};

export default Journal;